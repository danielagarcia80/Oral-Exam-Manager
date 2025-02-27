import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleController } from './role.controller';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { PrivilegeModule } from 'src/privilege/privilege.module';

@Module({
  imports: [forwardRef(() => PrivilegeModule)],
  providers: [RoleService, PrismaService, PrivilegeService],
  controllers: [RoleController],
  exports: [RoleService, PrivilegeService],
})
export class RoleModule {}
