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
import { writeFile, unlink, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import ffmpeg = require('fluent-ffmpeg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormData = require('form-data');
console.log('ffmpegStatic path:', ffmpegStatic);

ffmpeg.setFfmpegPath(ffmpegStatic);

async function convertToAudio(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath);

    command
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

async function transcribeInChunks(
  fileBuffer: Buffer,
  filename: string,
): Promise<string> {
  const MAX_CHUNK_SIZE = 24 * 1024 * 1024; // 24MB safe margin
  const partialTranscripts: string[] = [];

  let start = 0;
  while (start < fileBuffer.length) {
    const end = Math.min(start + MAX_CHUNK_SIZE, fileBuffer.length);
    const chunk = Buffer.from(fileBuffer.subarray(start, end));

    const formData = new FormData();
    formData.append('file', Readable.from(chunk) as any, { filename });
    formData.append('model', 'whisper-1');

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

    partialTranscripts.push(response.data.text);
    start = end;
  }

  return partialTranscripts.join(' ');
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
    const tempAudioPath = join(tmpDir, `${file.originalname}.wav`);

    // Step 1: Save uploaded video file
    await writeFile(tempWebmPath, file.buffer);

    try {
      // Step 2: Convert video to audio
      await convertToAudio(tempWebmPath, tempAudioPath);

      // Step 3: Read audio file
      const audioBuffer = await readFile(tempAudioPath);

      // Step 4: Transcribe audio chunks
      const transcription = await transcribeInChunks(
        audioBuffer,
        `${file.originalname}.wav`,
      );

      // Step 5: Save ExamSubmission
      const submission = await this.prisma.examSubmission.create({
        data: {
          student: {
            connect: { user_id: studentId },
          },
          exam: {
            connect: { exam_id: examId },
          },
          transcript: transcription,
          submitted_at: new Date(),
          attempt_number: 1,
          recording_url: recordingUrl,
          duration_minutes: 0,
          grade_percentage: 0,
          feedback: '',
        },
      });

      return submission;
    } finally {
      // Step 6: Cleanup temp files
      await unlink(tempWebmPath).catch(() => {});
      await unlink(tempAudioPath).catch(() => {});
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
