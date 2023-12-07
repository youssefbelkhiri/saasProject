import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaperDto } from './dto/paper.dto';
import { UpdatePapertDto } from './dto/update-paper.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PapersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPapers(){
    return await this.prisma.papers.findMany({})
  }

  async findPaper(id: number){
    const paper = await this.prisma.papers.findUnique({where: {paper_id: +id}})
    if (!paper) {
      throw new NotFoundException(`Can't find this paper : ${id}`)
    }
    return paper;
  }

  async importPaper(filename: string, paperDto: PaperDto) {
    const { exam_id, student_id } = paperDto;

    const exam = await this.prisma.exam.findUnique({ where: { exam_id: +exam_id } });
    const student = await this.prisma.students.findUnique({ where: { student_id: +student_id } });

    if (!exam || !student) {
      throw new NotFoundException("Can't fin associated exam or student");
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
  
  async updatePaper(id: number, paperDto: UpdatePapertDto){
    const paper = await this.prisma.papers.findUnique({ where: { paper_id: +id } });

    if (!paper) {
      throw new NotFoundException(`Can't find paper with id: ${id}`);
    }

    return await this.prisma.papers.update({
      where: { paper_id: +id },
      data: {
          ...paperDto
      },
    });
  }

  async deletePaper(id: number){
    const paper = await this.prisma.papers.findUnique({ where: { paper_id: +id } });

    if (!paper) {
      throw new NotFoundException(`Can't find paper with id: ${id}`);
    }

    const filePath = path.join(process.cwd(), 'uploads', paper.paper);

    try {
      fs.unlinkSync(filePath);
    } 
    catch (error) {
      console.error('Error deleting file:', error.message);
    }
    return await this.prisma.papers.delete({ where: { paper_id: +id } });
  }

}
