import { Controller, Get, Post, Body } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { EnrollmentResponseDto } from './enrollment-response.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async create(@Body() dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    return this.enrollmentService.create(dto);
  }

  @Get()
  async findAll(): Promise<EnrollmentResponseDto[]> {
    return this.enrollmentService.findAll();
  }
}
