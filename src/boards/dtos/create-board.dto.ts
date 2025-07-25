import { IsString, IsOptional } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
} 