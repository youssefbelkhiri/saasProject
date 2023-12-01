import { PartialType } from '@nestjs/mapped-types';
import { ExamDto } from './exam.dto';

export class UpdateExamDto extends PartialType(ExamDto) {}