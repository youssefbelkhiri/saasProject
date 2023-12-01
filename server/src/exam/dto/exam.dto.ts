import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";
import { CreateQuestionDto } from '../../questions/dto/create-question.dto'

export class ExamDto{
    name: string;
    exam_language: string;
    description: string;
    exam_time: number;
    total_points: number;

//   @ValidateNested({ each: true })
//   @Type(() => CreateQuestionDto)
//   questions: CreateQuestionDto[];


//   @ValidateNested({ each: true })
//   @IsInt()
//   user_id:number;

} 