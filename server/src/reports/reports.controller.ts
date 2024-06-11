/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsControllers {
  constructor(private reportsService: ReportsService) {}
  @Post('statistics')
  async statistcs(@Body() body, @Request() req) {
    const { group_id, exam_id } = body;
    return this.reportsService.getNotesStatistics(exam_id, req.user.id);
  }
}
