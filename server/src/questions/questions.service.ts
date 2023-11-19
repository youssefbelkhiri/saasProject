import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Options, Prisma, Questions  } from '@prisma/client';
import {CreateQuestionDto} from './dto/create-question.dto'
import {UpdateQuestionDto} from './dto/update-question.dto';
import { GenQuestionsService } from './generator/gen-questions.service';
import { PormptQuestion } from './dto/prompt-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService, private readonly GenQuestionsService: GenQuestionsService) {}

  async getAllQuestions(): Promise<Questions[]> {
    return this.prisma.questions.findMany({ include: { options: true } });
  }

  async getQuestionById(id: number): Promise<Questions> {
    const question = await this.prisma.questions.findUnique({
      where: {question_id: +id},
      include: {options: true},
    });
  
    if (!question) {
      throw new NotFoundException(`Can't find this question : ${id}`)
    }
  
    return question;
  }

  async createQuestion(questionData: CreateQuestionDto): Promise<Questions> {
    return await this.prisma.questions.create({
      data: {
        ...questionData,
        options: {
          create: questionData.options,
        }
      },
    });
  }


  async genQuestion(question: PormptQuestion){
    return this.GenQuestionsService.genQuestion(question)
  }

  async updateOption(id: number, optionData: Prisma.OptionsUpdateInput): Promise<Options>{
    const updatedOption = await this.prisma.options.update({
      where: { option_id: +id},
      data: optionData, 
    });

    if (!updatedOption) {
      throw new NotFoundException(`Can't find this option id : ${id} `)
    }

    return updatedOption;
  }


  async updateQuestion(id: number, questionData: UpdateQuestionDto): Promise<Questions> {
    const question = await this.prisma.questions.findUnique({where: { question_id: +id }});
    if (!question) {
      throw new NotFoundException(`Can't find this question id : ${id}`);
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
        });
      });
      await Promise.all(updateOptionPromises);
    }
  
    return updatedQuestion;
  }
  
  
  async deleteOption(id: number): Promise<Options> {
    const option = await this.prisma.options.findUnique({
      where: {
        option_id: +id,
      },
    });

    if (!option) {
      throw new NotFoundException(`Can't find this question id :  ${id}`);
    }

    await this.prisma.options.delete({
      where: {
        option_id: +id,
      },
    });

    return option;
  }


  async deleteQuestion(id: number): Promise<void> {
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
