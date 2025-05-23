import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourseMembershipService } from './course-membership.service';
import { CourseMembershipResponseDto } from './course-membership-response.dto';
import { CreateCourseMembershipDto } from './create-course-membership.dto';
import { UpdateCourseMembershipDto } from './update-course-membership.dto';
import { RemoveCourseMembershipDto } from './remove-course-membership.dto';
import { CourseRole } from '@prisma/client';

@Controller('course-membership')
export class CourseMembershipController {
  constructor(
    private readonly courseMembershipService: CourseMembershipService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateCourseMembershipDto,
  ): Promise<CourseMembershipResponseDto> {
    const { userId, courseId, role } = createDto;
    return this.courseMembershipService.create(userId, courseId, role);
  }

  @Get('course/:id')
  async getMembers(
    @Param('id') courseId: string,
  ): Promise<CourseMembershipResponseDto[]> {
    return this.courseMembershipService.findAllByCourse(courseId);
  }

  @Get('course/:courseId/user/:userId')
  async getUserRole(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ): Promise<CourseRole | null> {
    return this.courseMembershipService.getUserRole(userId, courseId);
  }

  @Patch()
  async updateRole(
    @Body() updateDto: UpdateCourseMembershipDto,
  ): Promise<CourseMembershipResponseDto> {
    const { userId, courseId, newRole } = updateDto;
    return this.courseMembershipService.updateRole(userId, courseId, newRole);
  }

  @Delete()
  async remove(@Body() removeDto: RemoveCourseMembershipDto): Promise<void> {
    const { userId, courseId } = removeDto;
    return this.courseMembershipService.remove(userId, courseId);
  }
}
