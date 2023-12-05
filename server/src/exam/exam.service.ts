import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDto, UpdateExamDto } from './dto';
import { Prisma } from '@prisma/client';
import * as PDFDocument from 'pdfkit';

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
    async exportExam(id:number): Promise<Buffer>{

        const exam  = await this.prisma.exam.findUnique({
            where:{  exam_id:+id },
            include: {questions: true},
        });
        const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });

      doc.text('Exam Title: '+exam.name, { align: 'center', fontSize: 20 });
      doc.text('Instructions: '+exam.description, { align: 'center', fontSize: 12 });
      doc.text('Time: '+exam.exam_time+' hours', { align: 'center', fontSize: 12 });
      doc.text('Total Points: '+exam.total_point, { align: 'center', fontSize: 12 });
      for (const question of exam.questions) {
        //let optionIndex = 0;
        doc.text("Q"+question.questionOrder+" : "+question.content, {fontSize: 14 });
        const options  = await this.prisma.options.findMany({
            where:{  questionId:+question.question_id },});
        for(const option of options){
            doc.text(option.optionOrder+" - "+option.option, {fontSize: 14 });
        }
        //console.log(options[0]);
        // while (optionIndex <= options.length) {
        //     let option1 = options[optionIndex];
        //     let option2 = null;

        //     if (optionIndex + 1 < options.length) {
        //         option2 = options[optionIndex + 1];
        //         optionIndex++;
        //     }

        //     doc.text(` ${option1.option}`, { fontSize: 12 });
        //     if (option2) {
        //         doc.text(` ${option2.option}`, { fontSize: 12, align: 'right' });
        //     }
            
        //     doc.moveDown();
        // }
      }

      doc.end();
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
    }
}
