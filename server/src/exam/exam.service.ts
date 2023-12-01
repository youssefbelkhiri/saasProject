import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDto, UpdateExamDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamService {
    constructor(private prisma:PrismaService){}
    async findExams(){
        return await this.prisma.exam.findMany({})
    }
    async findExam(id:number){
        return await this.prisma.exam.findUnique({
            where:{  exam_id:+id },
            include: {questions: true},
        })
        // const questions = await this.prisma.questions.findMany({
        //     where:{
        //         exam_id:+id
        //     }
        // })
        // return {exam,questions}
    }

    // OLD UPDATE EXAM FUNCTION
    // async updateExam(id: number, update_exam:Prisma.ExamUpdateInput){
    //     const updatedOption = await this.prisma.exam.update({
    //         where: { exam_id: +id},
    //         data: update_exam, 
    //     });
    // }

    // OLD CREATE EXAM FUNCTION
    // async createExam(dto:ExamDto){
    //     const exam= await this.prisma.exam.create({
    //         data:{
    //             user_id:+1,
    //             name:dto.name,
    //             exam_language:dto.exam_language,
    //             description:dto.description,
    //             exam_time:+dto.exam_time,
    //             total_point:+dto.total_points,
    //         }
    //     })
    //     return exam;
    // }

    async updateExam(id: number, ExamDto: UpdateExamDto){
        const { groups, ...restDto } = ExamDto; 

        if (groups && Array.isArray(groups)) {
            const groups_ids = groups.map(groupId => ({ group_id: groupId }));
    
            return await this.prisma.exam.update({
                where: { exam_id: +id },
                data: {
                    ...restDto,
                    groups: { set: groups_ids }, 
                },
            });
        }
        else {
            return await this.prisma.exam.update({
                where: { exam_id: +id },
                data: { ...restDto },
            });
        }
    }

    async createExam(dto: ExamDto) {
        const { groups, ...restDto } = dto;
    
        if (groups && Array.isArray(groups)) {
            const groupsIds = groups.map((groupId) => ({ group_id: groupId }));
        
            return await this.prisma.exam.create({
                data: {
                    ...restDto,
                    groups: { connect: groupsIds },
                },
            });
        } 
        else {
            return await this.prisma.exam.create({ data: { ...restDto } }); 
        }
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
