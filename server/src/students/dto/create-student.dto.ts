import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  student_number: string;

  @IsOptional()
  groups: number[];

  // @IsNotEmpty()
  // @IsInt()
  // user_id: number;
}
