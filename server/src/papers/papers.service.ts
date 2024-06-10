import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaperDto } from './dto/paper.dto';
import { UpdatePapertDto } from './dto/update-paper.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PapersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPaper(studentIds: number[], exam_id: number) {
    console.log(studentIds);
    const createPaperPromises = studentIds.map((student_id) => {
      return this.prisma.papers.create({
        data: {
          note: -1,
          paper: '',
          exam: { connect: { exam_id: +exam_id } },
          student: { connect: { student_id: +student_id } },
        },
      });
    });

    // Wait for all the papers to be created
    await Promise.all(createPaperPromises);

    return;
  }

  async findPapers(user_id: number) {
    return await this.prisma.papers.findMany({
      where: {
        exam: {
          user_id: +user_id,
        },
      },
    });
  }

  async findPaper(id: number, user_id: number) {
    const paper = await this.prisma.papers.findUnique({
      where: { paper_id: +id },
      include: {
        exam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!paper) {
      throw new NotFoundException(`Can't find this paper: ${id}`);
    }

    if (paper.exam.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    return paper;
  }

  async importPaper(filename: string, paperDto: PaperDto, user_id: number) {
    const { exam_id, student_id } = paperDto;

    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: +exam_id },
      select: {
        user_id: true,
      },
    });

    const student = await this.prisma.students.findUnique({
      where: { student_id: +student_id },
      select: {
        groups: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!exam || !student) {
      throw new NotFoundException("Can't fin associated exam or student");
    }

    if (!student.groups.some((group) => group.user_id === user_id)) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.prisma.papers.create({
      data: {
        note: -1,
        paper: filename,
        exam: { connect: { exam_id: +exam_id } },
        student: { connect: { student_id: +student_id } },
      },
    });
  }

  async updatePaper(id: number, paperDto: UpdatePapertDto, user_id: number) {
    const paper = await this.prisma.papers.findUnique({
      where: { paper_id: +id },
      include: {
        exam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!paper) {
      throw new NotFoundException(`Can't find paper with id: ${id}`);
    }

    if (paper.exam.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.prisma.papers.update({
      where: { paper_id: +id },
      data: {
        ...paperDto,
      },
    });
  }

  async deletePaper(id: number, user_id: number) {
    const paper = await this.prisma.papers.findUnique({
      where: { paper_id: +id },
      include: {
        exam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!paper) {
      throw new NotFoundException(`Can't find paper with id: ${id}`);
    }

    if (paper.exam.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const filePath = path.join(process.cwd(), 'uploads', paper.paper);

    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
    return await this.prisma.papers.delete({ where: { paper_id: +id } });
  }
}
