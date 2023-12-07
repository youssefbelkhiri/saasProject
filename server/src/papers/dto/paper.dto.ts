import { UploadedFile } from "@nestjs/common";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PaperDto{
  @IsOptional()
  @IsNumber()
  note: number;

  @IsOptional()
  @IsString()
  paper: string;

  // @IsInt()
  exam_id: number;

  // @IsInt()
  student_id: number;

}