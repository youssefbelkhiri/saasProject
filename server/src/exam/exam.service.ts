/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDto, UpdateExamDto } from './dto';
import { Prisma } from '@prisma/client';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async findExams(id: number) {
    return await this.prisma.exam.findMany({
      where: { user_id: +id },
    });
  }

  async findExam(id: number) {
    return await this.prisma.exam.findUnique({
      where: { exam_id: +id },
      include: { questions: true },
    });
  }

  async updateExam(id: number, ExamDto: UpdateExamDto) {
    const { groups, ...restDto } = ExamDto;

    if (groups && Array.isArray(groups)) {
      const groups_ids = groups.map((groupId) => ({ group_id: groupId }));

      return await this.prisma.exam.update({
        where: { exam_id: +id },
        data: {
          ...restDto,
          groups: { set: groups_ids },
        },
      });
    } else {
      return await this.prisma.exam.update({
        where: { exam_id: +id },
        data: { ...restDto },
      });
    }
  }

  async createExam(dto: ExamDto, id: number) {
    const { groups, ...restDto } = dto;

    if (groups && Array.isArray(groups)) {
      const groupsIds = groups.map((groupId) => ({ group_id: groupId }));

      return await this.prisma.exam.create({
        data: {
          user_id: id,
          ...restDto,
          groups: { connect: groupsIds },
        },
      });
    } else {
      return await this.prisma.exam.create({
        data: { user_id: id, ...restDto },
      });
    }
  }

  async deleteExam(id: number) {
    const exam = await this.prisma.exam.delete({
      where: {
        exam_id: +id,
      },
    });
    return { msg: 'exam numero : ' + id + ' deleted' };
  }

  async exportExam(id: number): Promise<Buffer> {
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: +id },
      include: { questions: true },
    });
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });

      doc.text('Exam Title: ' + exam.name, { align: 'center', fontSize: 20 });
      doc.text('Instructions: ' + exam.description, {
        align: 'center',
        fontSize: 12,
      });
      doc.text('Time: ' + exam.exam_time + ' hours', {
        align: 'center',
        fontSize: 12,
      });
      doc.text('Total Points: ' + exam.total_point, {
        align: 'center',
        fontSize: 12,
      });
      doc.moveDown();
      doc.moveDown();
      doc
        .moveTo(50, 130)
        .lineTo(doc.page.width - 50, 130)
        .stroke();
      for (const question of exam.questions) {
        doc.font('Helvetica-Bold');
        doc.text('Q' + question.questionOrder + ' : ' + question.content, {
          fontSize: 14,
        });
        const options = await this.prisma.options.findMany({
          where: { questionId: +question.question_id },
        });
        doc.moveDown();
        doc.font('Helvetica');
        for (const option of options) {
          doc.text(+option.optionOrder + ' - ' + option.option, {
            paddingLeft: 200,
            fontSize: 14,
          });
        }
        doc.moveDown();
      }
      doc.font('Helvetica');
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

  async exportAnswerSheet(examId: number, groupeid: number) {
    const group = await this.prisma.groups.findUnique({
      where: { group_id: +groupeid },
      include: { exam: true, students: true },
    });
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: +examId },
      include: { questions: true, groups: true },
    });
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
      for (const student of group.students) {
        doc.text('Exam Title: ' + exam.name, { align: 'center', fontSize: 20 });
        doc.moveUp();
        doc.text('First Name: ' + student.first_name, {
          align: 'right',
          fontSize: 12,
        });
        // doc.text('Instructions: '+exam.description, { align: 'center', fontSize: 12 });
        doc.text('Time: ' + exam.exam_time + ' min', {
          align: 'center',
          fontSize: 12,
        });
        doc.moveUp();
        doc.text('Last Name: ' + student.last_name, {
          align: 'right',
          fontSize: 12,
        });
        doc.moveUp();
        doc.moveDown();
        doc.text('Total Points: ' + exam.total_point, {
          align: 'center',
          fontSize: 12,
        });
        doc.moveUp();
        doc.text('Student Id: ' + student.student_number, {
          align: 'right',
          fontSize: 12,
        });
        doc.moveDown();
        doc.moveDown();
        doc
          .moveTo(50, 130)
          .lineTo(doc.page.width - 50, 130)
          .stroke();

        for (const question of exam.questions) {
          doc.text('Answer of Question ' + question.questionOrder + ' is : ');
          doc.moveDown();
        }
        doc.addPage();
        doc.moveTo(0, 0);
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


  async exportAnswerSheetAll(examId: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: +examId },
      include: { questions: true },
    });
  
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });
  
      doc.text('Exam Title: ' + exam.name, { align: 'center', fontSize: 20 });
      doc.text('Time: ' + exam.exam_time + ' min', {
        align: 'center',
        fontSize: 12,
      });
      doc.text('Total Points: ' + exam.total_point, {
        align: 'center',
        fontSize: 12,
      });
      doc.moveDown();
  
      for (const question of exam.questions) {
        doc.text('Answer of Question ' + question.questionOrder + ' is : ');
        doc.moveDown();
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
