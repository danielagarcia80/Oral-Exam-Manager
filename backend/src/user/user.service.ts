import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(uuid?: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { id: uuid } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }
}
