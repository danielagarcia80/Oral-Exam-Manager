import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeachesDto } from './create-teaches.dto';
import { TeachesResponseDto } from './teaches-response.dto';

@Injectable()
export class TeachesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeachesDto): Promise<TeachesResponseDto> {
    // Validate course exists
    const course = await this.prisma.course.findUnique({
      where: { course_id: dto.course_id },
    });
    if (!course) throw new NotFoundException('Course not found');

    // Validate user exists and is an instructor
    const instructor = await this.prisma.user.findUnique({
      where: { user_id: dto.instructor_id },
    });
    if (!instructor) throw new NotFoundException('User (instructor) not found');
    if (instructor.role !== 'INSTRUCTOR') {
      throw new BadRequestException('User is not an instructor');
    }

    // Create teaches record
    const teaches = await this.prisma.teaches.create({ data: dto });
    return this.toTeachesResponse(teaches);
  }

  async findAll(): Promise<TeachesResponseDto[]> {
    const records = await this.prisma.teaches.findMany();
    return records.map(this.toTeachesResponse);
  }

  async findOne(id: string): Promise<TeachesResponseDto> {
    const record = await this.prisma.teaches.findUnique({ where: { id } });
    return this.toTeachesResponse(record);
  }

  async delete(id: string): Promise<TeachesResponseDto> {
    const deleted = await this.prisma.teaches.delete({ where: { id } });
    return this.toTeachesResponse(deleted);
  }

  private toTeachesResponse(entity: any): TeachesResponseDto {
    return {
      id: entity.id,
      course_id: entity.course_id,
      instructor_id: entity.instructor_id,
    };
  }
}
