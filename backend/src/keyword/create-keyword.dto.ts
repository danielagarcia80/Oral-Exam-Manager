import { IsString } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  text: string;
}
