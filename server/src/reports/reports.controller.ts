/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsControllers {
  constructor(private reportsService: ReportsService) {}
  @Post('statistics')
  async statistcs(@Body() body) {
    const { group_id, exam_id } = body;
    return this.reportsService.getNotesStatistics(exam_id, group_id);
  }
}
