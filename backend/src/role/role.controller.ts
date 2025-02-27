import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleBody } from './role';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll() {
    try {
      const res = await this.roleService.findAll();
      if (!res) {
        throw new HttpException(
          {
            message: 'Role not found',
            error: 'Role not found',
          },
          500,
        );
      }
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Post()
  async create(@Body() dto: RoleBody) {
    try {
      const res = await this.roleService.create(dto);
      if (!res) {
        throw new HttpException(
          {
            message: 'Role Creation Failed',
            error: 'Role Creation Failed',
          },
          500,
        );
      }
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
