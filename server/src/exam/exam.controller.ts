/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamDto, UpdateExamDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamController {
  constructor(private examService: ExamService) {}

  @Get('/')
  findExams(@Request() req) {
    return this.examService.findExams(req.user.id);
  }

  @Get('/:id')
  async findExam(@Param('id') id: number, @Request() req) {
    const { user } = req;
    const userExam = await this.examService.findExam(id);

    if (user.id === userExam.user_id) {
      return userExam;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }

  @Post('new')
  createExam(@Body() dto: ExamDto, @Request() req) {
    return this.examService.createExam(dto, req.user.id);
  }

  @Patch(':id')
  async updateExam(
    @Param('id') id: number,
    @Body() examDto: UpdateExamDto,
    @Request() req,
  ) {
    const userExam = await this.examService.findExam(id);

    if (req.user.id !== userExam.user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    return this.examService.updateExam(id, examDto);
  }

  @Delete(':id')
  async deleteExam(@Param('id') id: number, @Request() req) {
    const userExam = await this.examService.findExam(id);

    if (req.user.id !== userExam.user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    return this.examService.deleteExam(id);
  }

  @Get(':id/export')
  async exportExam(@Param('id') id: number, @Res() res): Promise<void> {
    const pdfBuffer = await this.examService.exportExam(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=exam.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id/exportAnswerSheet/:groupid')
  async exportAnswerSheet(
    @Param('id') id: number,
    @Param('groupid') groupeid: number,
    @Res() res,
  ): Promise<void> {
    const pdfBuffer = await this.examService.exportAnswerSheet(id, groupeid);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=exam.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
