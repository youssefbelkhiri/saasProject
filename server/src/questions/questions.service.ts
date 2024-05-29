import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Options, Prisma, Questions  } from '@prisma/client';
import {CreateQuestionDto} from './dto/create-question.dto'
import {UpdateQuestionDto} from './dto/update-question.dto';
import { GenQuestionsService } from './generator/gen-questions.service';
import { PormptQuestion } from './dto/prompt-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService, private readonly GenQuestionsService: GenQuestionsService) {}

  async getAllQuestions(id: number): Promise<Questions[]> {
    return this.prisma.questions.findMany({
      where: {
        examR: { user_id: +id, },
      },
      include: { options: true },
    });
  }

  async getQuestionById(id: number, user_id: number): Promise<Questions> {
    const question = await this.prisma.questions.findUnique({
      where: {question_id: +id},
      include: {options: true, examR:true},
    });
  
    if (!question) {
      throw new NotFoundException(`Can't find this question : ${id}`)
    }

    if (question.examR.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }
  
    return question;
  }

  async createQuestion(CreateQuestionDto:CreateQuestionDto, user_id: number) {
    const exam = await this.prisma.exam.findFirst({
      where: {
        user_id: +user_id,
        exam_id: CreateQuestionDto.exam_id,
      },
    });
  
    if (!exam) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.prisma.questions.create({
      data: {
        ...CreateQuestionDto,
        options:{
          createMany:{
            data:CreateQuestionDto.options
          }
        }
      },
    })
    
  }


  async genQuestion(question: PormptQuestion, user_id: number){
    const exam = await this.prisma.exam.findFirst({
      where: {
        user_id: +user_id,
        exam_id: question.exam_id,
      },
    });
  
    // if (!exam) {
    //   throw new HttpException('Unauthorized', 401);
    // }

    return this.GenQuestionsService.genQuestion(question)
  }

  async updateOption(id: number, optionData: Prisma.OptionsUpdateInput, user_id: number): Promise<Options>{
    const option = await this.prisma.options.findUnique({
      where: {
        option_id: +id,
      },
      include: {
        question: {
          select: {
            examR: true,
          },
        },
      },
    });

    if (!option) {
      throw new NotFoundException(`Can't find this option id :  ${id}`);
    }

    if (option.question.examR.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const updatedOption = await this.prisma.options.update({
      where: { option_id: +id},
      data: optionData, 
    });

    return updatedOption;
  }


  async updateQuestion(id: number, questionData: UpdateQuestionDto, user_id: number): Promise<Questions> {
    const question = await this.prisma.questions.findUnique({
      where: { question_id: +id },
      include: { examR: true },
    });
  
    if (!question) {
      throw new NotFoundException(`Can't find this question id : ${id}`);
    }

    if (question.examR.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const updatedQuestion = await this.prisma.questions.update({
      where: {  question_id: +id },
      data: {
        questionOrder: questionData.questionOrder,
        content: questionData.content,
        difficulty: questionData.difficulty,
        points: questionData.points,
      },
      include: { options: true },
    });
  
  
    if (questionData.options) {
      const updateOptionPromises = questionData.options.map(async (optionData) => {
        return this.updateOption(optionData.option_id, {
          optionOrder: optionData.optionOrder,
          option: optionData.option,
          correct: optionData.correct,
        },user_id);
      });
      await Promise.all(updateOptionPromises);
    }
  
    return updatedQuestion;
  }
  
  
  async deleteOption(id: number, user_id: number): Promise<Options> {
    const option = await this.prisma.options.findUnique({
      where: {
        option_id: +id,
      },
      include: {
        question: {
          select: {
            examR: true,
          },
        },
      },
    });

    if (!option) {
      throw new NotFoundException(`Can't find this option id :  ${id}`);
    }

    if (option.question.examR.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    await this.prisma.options.delete({
      where: {
        option_id: +id,
      },
    });

    return option;
  }


  async deleteQuestion(id: number, user_id: number): Promise<void> {
    const question = await this.prisma.questions.findUnique({
      where: { question_id: +id },
      include: { examR: true },
    });
  
    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }
  
    if (question.examR.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }
  
    await this.prisma.options.deleteMany({
      where: {
        questionId: +id,
      },
    });
  
    await this.prisma.questions.delete({
      where: {
        question_id: +id,
      },
    });
  }
  

}
