import { Module } from '@nestjs/common';
import { TeachesService } from './teaches.service';
import { TeachesController } from './teaches.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TeachesController],
  providers: [TeachesService, PrismaService],
})
export class TeachesModule { }
