/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Prisma, Questions } from '@prisma/client';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PormptQuestion } from './dto/prompt-question.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getAllQuestions(@Request() req) {
    return this.questionsService.getAllQuestions(req.user.id);
  }

  @Get('/:id')
  async getQuestionById(@Param('id') id: number, @Request() req) {
    return await this.questionsService.getQuestionById(id, req.user.id);
  }

  @Post()
  async createQuestion(@Body() CreateQuestionDto: CreateQuestionDto, @Request() req) { 
    return await this.questionsService.createQuestion(CreateQuestionDto, req.user.id);
  }

  @Post('/gen')
  async genQuestion(@Body() question: PormptQuestion, @Request() req) {
    return this.questionsService.genQuestion(question, req.user.id);
  }

  @Patch('/option/:id')
  async updateOption( @Param('id') id: number, @Body() optionData: Prisma.OptionsUpdateInput, @Request() req) {
    return await this.questionsService.updateOption(id, optionData, req.user.id);
  }

  @Patch(':id')
  async updateQuestion(@Param('id') id: number, @Body() questionData: UpdateQuestionDto, @Request() req) {
    return this.questionsService.updateQuestion(id, questionData, req.user.id);
  }

  @Delete('/option/:id')
  async deleteOption(@Param('id') id: number, @Request() req) {
    return this.questionsService.deleteOption(id, req.user.id);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number, @Request() req) {
    return this.questionsService.deleteQuestion(id, req.user.id);
  }
}
