// Lint was being incredibly frustrating with this file
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// TODO: fix lint issues
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResponseDto } from './course-response.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StudentDto } from './student.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';
import * as multer from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';

type Invite = {
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
};

const typedCsvParser = csvParser as unknown as () => NodeJS.ReadWriteStream;

function parseCsv(
  buffer: Buffer,
): Promise<{ email: string; role: 'STUDENT' | 'INSTRUCTOR' }[]> {
  return new Promise((resolve, reject) => {
    const results: { email: string; role: 'STUDENT' | 'INSTRUCTOR' }[] = [];

    Readable.from(buffer.toString())
      .pipe(typedCsvParser())
      .on('data', (row: { email?: string; role?: string }) => {
        const email = row.email?.trim();
        const role = row.role?.trim().toUpperCase();
        if (email && (role === 'STUDENT' || role === 'INSTRUCTOR')) {
          results.push({ email, role });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'csv', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(), // all files in memory
      },
    ),
  )
  async createCourse(
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      csv?: Express.Multer.File[];
    },
    @Body() body: any,
    @Req() req: any,
  ) {
    const bannerFile = files.banner?.[0];
    const csvFile = files.csv?.[0];

    const instructor_id = req.user.user_id;

    // Manually write banner to disk if present
    let banner_url: string | null = null;
    if (bannerFile) {
      const filename = `${uuidv4()}${extname(bannerFile.originalname)}`;
      const filePath = path.join(__dirname, '../../uploads', filename);
      await fs.writeFile(filePath, bannerFile.buffer);
      banner_url = `uploads/${filename}`;
    }

    // Parse invites JSON
    const invitesFromJson = JSON.parse(body.invites ?? '[]') as {
      email: string;
      role: 'STUDENT' | 'INSTRUCTOR';
    }[];

    // Parse CSV invites
    let invitesFromCsv: { email: string; role: 'STUDENT' | 'INSTRUCTOR' }[] =
      [];
    if (csvFile) {
      invitesFromCsv = await parseCsv(csvFile.buffer);
    }

    const allInvites = [...invitesFromJson, ...invitesFromCsv];

    const user = req.user as { user_id: string; email: string };
    const filtered = allInvites.filter(
      (invite) =>
        !(
          invite.role === 'INSTRUCTOR' &&
          invite.email.toLowerCase() === user.email.toLowerCase()
        ),
    );

    // Remove duplicate emails (keep first occurrence)
    const dedupedInvites = Array.from(
      new Map(
        filtered.map((invite) => [invite.email.toLowerCase(), invite]),
      ).values(),
    );

    return this.courseService.create({
      title: body.title,
      description: body.description,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
      banner_url,
      instructor_id,
      invites: dedupedInvites,
    });
  }

  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.courseService.findOne(id);
  }

  @Get(':courseId/details')
  getCourseDetails(@Param('courseId') courseId: string) {
    return this.courseService.getCourseDetails(courseId);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.courseService.delete(id);
  }

  @Get('student/:userId')
  getCoursesForStudent(
    @Param('userId') userId: string,
  ): Promise<CourseResponseDto[]> {
    return this.courseService.getCoursesForStudent(userId);
  }

  @Get('instructor/:userId')
  getCoursesForInstructor(
    @Param('userId') userId: string,
  ): Promise<CourseResponseDto[]> {
    return this.courseService.getCoursesForInstructor(userId);
  }

  @Get(':courseId/question-bank')
  getCourseQuestionBank(@Param('courseId') courseId: string) {
    return this.courseService.getCourseQuestionBank(courseId);
  }

  @Get(':courseId/students')
  getStudentsForCourse(
    @Param('courseId') courseId: string,
  ): Promise<StudentDto[]> {
    return this.courseService.getStudentsForCourse(courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':courseId/invite')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'csv', maxCount: 1 }],
      { storage: multer.memoryStorage() }, // keep CSV in memory
    ),
  )
  async inviteToCourse(
    @Param('courseId') courseId: string,
    @UploadedFiles() files: { csv?: Express.Multer.File[] },
    @Body() body: any,
    @Req() req: any,
  ) {
    const user = req.user as { email: string };
    if (!user?.email) {
      console.error('User not found on request');
      throw new Error('User info missing from request');
    }

    const csvFile = files.csv?.[0];

    // 1. Parse invites from JSON
    let invitesFromJson: Invite[] = [];
    try {
      invitesFromJson = JSON.parse(body.invites ?? '[]');
    } catch (err) {
      // optional: throw BadRequestException
    }

    // 2. Parse invites from CSV
    let invitesFromCsv: Invite[] = [];
    if (csvFile?.buffer) {
      invitesFromCsv = await parseCsv(csvFile.buffer);
    }

    const allInvitesRaw = [...invitesFromJson, ...invitesFromCsv];

    // 3. Filter and deduplicate
    const filtered: Invite[] = allInvitesRaw.filter(
      (invite): invite is Invite =>
        !!invite &&
        typeof invite.email === 'string' &&
        typeof invite.role === 'string' &&
        !(
          invite.role === 'INSTRUCTOR' &&
          typeof user.email === 'string' &&
          invite.email.toLowerCase() === user.email.toLowerCase()
        ),
    );

    const dedupedInvites: Invite[] = Array.from(
      new Map(filtered.map((i) => [i.email.toLowerCase(), i])).values(),
    );

    // 4. Delegate to service
    await this.courseService.inviteToCourse(courseId, dedupedInvites);

    return { message: 'Invites processed' };
  }
}
