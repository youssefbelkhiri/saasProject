import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';

@Module({
  providers: [ExamService],
  controllers: [ExamController]
})
export class ExamModule {}
