import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get('instructor/:instructorId/students')
  getStudentsForInstructor(
    @Param('instructorId') instructorId: string,
  ): Promise<UserResponseDto[]> {
    return this.userService.getStudentsForInstructor(instructorId);
  }
}
