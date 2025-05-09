/*
 * This file is so cursed. Mainly because of Whisper's 25 MB limit. There is a way to run it locally
 * since it's open source and apparently that doesn't have a limit. But for now we'll all suffer with
 * this abomination. Hey it works.. kinda. With the chunking the transcript sometimes has some weird
 * duplicates butIt's not that bad... I think. If we get another model to summarize the transcript then
 * the duplicate words will just get ignored.
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamSubmissionDto } from './create-exam-submission.dto';
import { ExamSubmissionResponseDto } from './exam-submission-response.dto';
import axios from 'axios';
import { writeFile, unlink, mkdir, readFile, readdir, rm } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import OpenAI from 'openai';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import ffmpeg = require('fluent-ffmpeg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormData = require('form-data');
console.log('ffmpegStatic path:', ffmpegStatic);
import * as path from 'path';


// Helper functions
type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeTranscript(transcript: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an AI that summarizes student exam answers. 
Focus on extracting the key ideas the student mentions. 
Ignore filler words or off-topic remarks. 
Summarize clearly in a few bullet points if possible.`,
      },
      {
        role: 'user',
        content: `Here is the student's full transcript:\n\n${transcript}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 500,
  });

  const summary = response.choices[0].message?.content;
  if (!summary) {
    throw new Error('Failed to get summary from OpenAI');
  }

  return summary.trim();
}

ffmpeg.setFfmpegPath(ffmpegStatic);

async function convertToAudio(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .toFormat('wav')
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => {
        console.error('FFmpeg conversion error:', err);
        reject(err);
      })
      .run();
  });
}

async function splitAudioByTime(
  inputPath: string,
  outputDir: string,
  chunkSeconds = 300, // default: 5 minutes
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const outputPattern = join(outputDir, 'chunk_%03d.wav');
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .toFormat('wav')
      .outputOptions([
        '-f', 'segment',
        '-segment_time', String(chunkSeconds),
      ])
      .output(outputPattern)
      .on('end', async () => {
        const files = await readdir(outputDir);
        const chunkPaths = files
          .filter(f => f.startsWith('chunk_') && f.endsWith('.wav'))
          .map(f => join(outputDir, f));
        resolve(chunkPaths);
      })
      .on('error', reject)
      .run();
  });
}

async function transcribeChunksSequentially(
  paths: string[],
): Promise<{ fullText: string; segments: TranscriptSegment[] }> {
  const allSegments: TranscriptSegment[] = [];
  const fullTextParts: string[] = [];

  for (const filePath of paths) {
    const formData = new FormData();
    formData.append('file', createReadStream(filePath), {
      filename: path.basename(filePath),
    });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );

    const { text, segments } = response.data;

    fullTextParts.push(text);
    allSegments.push(
      ...segments.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text.trim(),
      })),
    );
  }

  return {
    fullText: fullTextParts.join(' '),
    segments: allSegments,
  };
}

@Injectable()
export class ExamSubmissionService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateExamSubmissionDto,
  ): Promise<ExamSubmissionResponseDto> {
    const student = await this.prisma.user.findUnique({
      where: { user_id: dto.student_id },
    });
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: dto.exam_id },
    });

    if (!student || !exam) {
      throw new BadRequestException('Invalid student_id or exam_id');
    }

    return this.prisma.examSubmission.create({
      data: {
        ...dto,
        submitted_at: new Date(),
      },
    });
  }

  async uploadAndTranscribe(
    file: Express.Multer.File,
    studentId: string,
    examId: string,
    recordingUrl: string,
  ) {
    const tmpDir = './transcript-tmp';
    if (!existsSync(tmpDir)) {
      await mkdir(tmpDir);
    }
  
    const tempWebmPath = join(tmpDir, file.originalname);
    const tempWavPath = join(tmpDir, `${file.originalname}.wav`);
    const chunkDir = join(tmpDir, `chunks_${Date.now()}`);
    await mkdir(chunkDir);
  
    await writeFile(tempWebmPath, file.buffer);
  
    try {
      // Step 1: WebM → WAV
      await convertToAudio(tempWebmPath, tempWavPath);
  
      // Step 2: Split WAV into chunks
      const chunkPaths = await splitAudioByTime(tempWavPath, chunkDir);
  
      // Step 3: Transcribe each chunk
      const { fullText, segments } = await transcribeChunksSequentially(chunkPaths);
  
      // Step 4: Summarize
      const summary = await summarizeTranscript(fullText);
  
      // Step 5: Save ExamSubmission
      const submission = await this.prisma.examSubmission.create({
        data: {
          student: { connect: { user_id: studentId } },
          exam: { connect: { exam_id: examId } },
          transcript: fullText,
          summary,
          submitted_at: new Date(),
          attempt_number: 1,
          recording_url: recordingUrl,
          duration_minutes: 0,
          grade_percentage: 0,
          feedback: '',
        },
      });
  
      await this.prisma.transcriptSegment.createMany({
        data: segments.map((seg) => ({
          submission_id: submission.submission_id,
          start_seconds: seg.start,
          end_seconds: seg.end,
          text: seg.text,
        })),
      });
  
      return submission;
    } finally {
      await unlink(tempWebmPath).catch(() => {});
      await unlink(tempWavPath).catch(() => {});
      await rm(chunkDir, { recursive: true, force: true }).catch(() => {});
    }
  }
  

  async findAll(): Promise<ExamSubmissionResponseDto[]> {
    return this.prisma.examSubmission.findMany();
  }

  async findByExamId(examId: string) {
    return this.prisma.examSubmission.findMany({
      where: { exam_id: examId },
      include: {
        student: true,
        transcriptSegments: {
          orderBy: { start_seconds: 'asc' },
        },
      },
    });
  }

  async updateGrade(
    studentId: string,
    examId: string,
    grade: number,
    feedback: string,
  ) {
    return this.prisma.examSubmission.updateMany({
      where: {
        student_id: studentId,
        exam_id: examId,
      },
      data: {
        grade_percentage: grade,
        feedback: feedback,
      },
    });
  }
}
