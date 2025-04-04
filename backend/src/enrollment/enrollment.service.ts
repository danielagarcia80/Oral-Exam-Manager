import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { EnrollmentResponseDto } from './enrollment-response.dto';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    // 1. Check if the user exists and is a student
    const user = await this.prisma.user.findUnique({
      where: { user_id: data.student_id },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.role !== 'STUDENT') {
      throw new BadRequestException(
        'Only users with the STUDENT role can be enrolled.',
      );
    }

    // 2. Create the enrollment
    return this.prisma.enrollment.create({ data });
  }

  async findAll(): Promise<EnrollmentResponseDto[]> {
    return this.prisma.enrollment.findMany();
  }
}
