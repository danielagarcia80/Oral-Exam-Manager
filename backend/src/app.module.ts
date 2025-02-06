import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
