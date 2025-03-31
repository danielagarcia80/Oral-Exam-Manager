import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  account_creation_date: string; // Prisma expects Date, but client sends ISO string

  @IsOptional()
  @IsString()
  otter_id?: string;

  @IsEnum(Role)
  role: Role;

  // Optional fields for OAuth profile
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDateString()
  emailVerified?: string;
}
