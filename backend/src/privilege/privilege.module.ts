import { forwardRef, Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [forwardRef(() => RoleModule)],
  providers: [PrivilegeService, PrismaService, RoleService],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
