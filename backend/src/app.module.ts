import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';

@Module({
  imports: [
    TestModule,
    AuthModule,
    TokenModule,
    PrivilegeModule,
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
