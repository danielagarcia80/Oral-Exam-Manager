import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token, TokenStatus } from '@prisma/client';
import { Uuid } from 'src/utils/uuid';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async findOne(uuid?: string) {
    return await this.prisma.token.findFirst({ where: { uuid } });
  }

  async create(role_uuid?: string, user_id?: string): Promise<Token> {
    const newToken: Token = {
      uuid: new Uuid().generateUUID(),
      date_created: new Date(),
      status: TokenStatus.ACTIVE,
      token: new Uuid().generateAccessToken(32),
      user_id,
      role_uuid,
    };
    return await this.prisma.token.create({ data: newToken });
  }

  async getNewToken(role_uuid?: string, user_id?: string): Promise<Token> {
    const token = await this.findOne();
    if (token) {
      return token;
    } else {
      return await this.create(role_uuid, user_id);
    }
  }
}
