import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamService {
    constructor(private prisma:PrismaService){}
    async findExams(){
        return await this.prisma.exam.findMany({})
    }
    async findExam(id:number){
        const exam = await this.prisma.exam.findUnique({
            where:{
                exam_id:+id
            }
        })
        const questions = await this.prisma.questions.findMany({
            where:{
                exam_id:+id
            }
        })
        return {exam,questions}
    }
    async updateExam(id: number, update_exam:Prisma.ExamUpdateInput){
        const updatedOption = await this.prisma.exam.update({
          where: { exam_id: +id},
          data: update_exam, 
        });
    }
    async createExam(dto:ExamDto){
        const exam= await this.prisma.exam.create({
            data:{
                user_id:+1,
                name:dto.name,
                exam_language:dto.exam_language,
                description:dto.description,
                exam_time:+dto.exam_time,
                total_point:+dto.total_points,
            }
        })
        return exam;
    }
    async deleteExam(id:number){
        const exam = await this.prisma.exam.delete({
            where:{
                exam_id:+id
            }
        })
        return {msg:'exam numero : '+ id+' deleted'}
    }
    async exportExam(id:number){
        const exam = await this.prisma.exam.findUnique({
            where:{
                exam_id:+id
            }
        })
        return exam
    }
}
