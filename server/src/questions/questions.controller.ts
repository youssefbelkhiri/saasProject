import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Prisma, Questions } from '@prisma/client';
import {CreateQuestionDto} from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PormptQuestion } from './dto/prompt-question.dto';


@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @Get('/:id')
  async getQuestionById(@Param('id') id: number) {
    return await this.questionsService.getQuestionById(id);
  }

  @Post()
  async createQuestion(@Body() questionData: CreateQuestionDto) {
    const createdQuestion = await this.questionsService.createQuestion(questionData);
    return createdQuestion;
  }

  @Post("/gen")
  async genQuestion(@Body() question: PormptQuestion) {
    return this.questionsService.genQuestion(question)
  }

  @Patch('/option/:id')
  async updateOption(@Param('id') id: number, @Body() optionData: Prisma.OptionsUpdateInput) {
    return await this.questionsService.updateOption(id, optionData);
  }

  @Patch(':id')
  async updateQuestion(@Param('id') id: number, @Body() questionData: UpdateQuestionDto) {
    return this.questionsService.updateQuestion(id, questionData);
  }

  @Delete('/option/:id')
  async deleteOption(@Param('id') id: number) {
    return this.questionsService.deleteOption(id);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number) {
    return this.questionsService.deleteQuestion(id);
  }

}
