/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';

// export class ExamDto{
//     name: string;
//     exam_language: string;
//     description: string;
//     exam_time: number;
//     total_points: number;

//     @IsInt()
//     user_id:number;

//     @IsOptional()
//     groups: number[];

// //   @ValidateNested({ each: true })
// //   @Type(() => CreateQuestionDto)
// //   questions: CreateQuestionDto[];

// //   @ValidateNested({ each: true })
// //   @IsInt()
// //   user_id:number;

// }

export class ExamDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  exam_language: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  exam_time: number;

  @IsNotEmpty()
  @IsNumber()
  total_point: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsOptional()
  groups: number[];
}
