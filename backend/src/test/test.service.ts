import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestFunctionDto, TestFunctionRes } from './test.dto';
import { Test } from '@prisma/client';

@Injectable()
export class TestService {
    constructor(
        private prisma: PrismaService,
    ) { }

    /*
    * Create a test function
        @param dto TestFunctionDto
        @returns TestFunctionRes
    */
    async createTest(dto: TestFunctionDto): Promise<Test> {

        const test = await this.prisma.test.create({
            data: {
                email: dto.email,
                name: dto.name,
            },
        });

        if (test) {
            return test;
        }
        throw new HttpException(
            {
                message: 'Test Creation Failed',
                error: 'Test Creation Failed'
            },
            500
        );
    }
}
