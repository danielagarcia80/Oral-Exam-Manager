
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeachesDto } from './create-teaches.dto';
import { TeachesResponseDto } from './teaches-response.dto';

@Injectable()
export class TeachesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeachesDto): Promise<TeachesResponseDto> {
    // Check if instructor and course exist
    const instructor = await this.prisma.user.findUnique({ where: { user_id: dto.instructor_id } });
    const course = await this.prisma.course.findUnique({ where: { course_id: dto.course_id } });

    if (!instructor || !course) {
      throw new BadRequestException('Invalid instructor_id or course_id');
    }

    if (instructor.role !== 'INSTRUCTOR') {
      throw new BadRequestException('User is not an instructor');
    }

    return this.prisma.teaches.create({ data: dto });
  }

  async findAll(): Promise<TeachesResponseDto[]> {
    return this.prisma.teaches.findMany();
  }
}
