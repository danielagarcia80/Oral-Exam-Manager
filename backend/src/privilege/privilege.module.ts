import { Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';

@Module({
  providers: [PrivilegeService, PrismaService, RoleService],
})
export class PrivilegeModule {}
