import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOptionDto {
  @IsInt()
  option_id: number;

  @IsInt()
  optionOrder: number;

  @IsString()
  @IsNotEmpty()
  option: string;

  @IsNotEmpty()
  correct: boolean;
}

export class CreateQuestionDto {
  @IsInt()
  questionOrder: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsInt()
  points: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
