/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getNotesStatistics(exam_id: number, groupe_id: number, user_id: number) {
    const group = await this.prismaService.groups.findUnique({
      where: {
        group_id: +groupe_id,
      },
      select: {
        user_id: true,
      },
    });

    const exam = await this.prismaService.exam.findUnique({
      where: {
        exam_id: +exam_id,
      },
      select: {
        user_id: true,
      },
    });

    if (!group || !exam) {
      throw new NotFoundException(`Can't find exam or group`);
    }
  
    if (exam.user_id !== user_id || group.user_id !== user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    

    const studentsInGroup = await this.prismaService.student_group.findMany({
      where: {
        group_id: +groupe_id,
      },
      select: {
        student_id: true,
      },
    });


    console.log(studentsInGroup)

    const studentIds = studentsInGroup.map((student) => student.student_id);
    console.log(studentIds)

    const results = await this.prismaService.papers.groupBy({
      by: ['exam_id'],
      _min: {
        note: true,
      },
      _avg: {
        note: true,
      },
      _max: {
        note: true,
      },
      where: {
        exam_id,
        student_id: {
          in: studentIds,
        },
      },
      orderBy: {
        _sum: {
          note: 'desc',
        },
      },
    });
    const grad = await this.prismaService.papers.findMany({
      where: {
        student_id: {
          in: studentIds,
        },
      },
      select: {
        note: true,
      },
    });
    const gradeCounts = {
      'Non validé': 0,
      Passable: 0,
      'Assez bien': 0,
      Bien: 0,
      'Très bien': 0,
      Excellent: 0,
    };

    grad.forEach((not) => {
      const { note } = not;
      if (+note < 10) {
        gradeCounts['Non validé'] += 1;
      } else if (+note < 12) {
        gradeCounts['Passable'] += 1;
      } else if (+note < 14) {
        gradeCounts['Assez bien'] += 1;
      } else if (+note < 16) {
        gradeCounts['Bien'] += 1;
      } else if (+note < 18) {
        gradeCounts['Très bien'] += 1;
      } else {
        gradeCounts['Excellent'] += 1;
      }
    });

    return { result: results, gradeCounts };
  }
}
