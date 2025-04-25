import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamSubmissionDto } from './create-exam-submission.dto';
import { ExamSubmissionResponseDto } from './exam-submission-response.dto';
import axios from 'axios';
import * as FormData from 'form-data';
import { writeFile, unlink } from 'fs/promises';

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
  ) {
    // Step 1: Save file temporarily
    const tempPath = `./transcript-tmp/${file.originalname}`;
    await writeFile(tempPath, file.buffer);

    try {
      // Step 2: Call OpenAI Whisper
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
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

      const transcription = response.data.text;

      // Step 3: Create ExamSubmission
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
          attempt_number: 1, // or whatever logic you want
          recording_url: '', // you'll fill this later
          duration_minutes: 0.0, // set to 0 for now
          grade_percentage: 0.0, // set to 0 initially
          feedback: '', // empty string initially
        },
      });

      return submission;
    } finally {
      // Clean up temp file if needed (not strictly necessary here)
      await unlink(tempPath).catch(() => {});
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
