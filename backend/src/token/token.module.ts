import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenStrategy } from './token.strategy';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    TokenService,
    PrismaService,
    TokenStrategy,
    PrivilegeService,
    RoleService,
    UserService,
  ],
  controllers: [TokenController],
  exports: [TokenStrategy],
})
export class TokenModule {}
