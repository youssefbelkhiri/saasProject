/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudents(user_id: number) {
    return this.prisma.students.findMany({
      where: {
        groups: {
          some: {
            user_id: +user_id,
          },
        },
      },
      include: {
        groups: true,
      },
    });
  }

  async getStudent(id: number, user_id: number) {
    const student = await this.prisma.students.findUnique({
      where: { student_id: +id },
      include: {
        groups: {
          where: {
            user_id: +user_id,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Can't find this student : ${id}`);
    }

    // if (!student.groups.some((group) => group.user_id === user_id)) {
    //   throw new HttpException('Unauthorized', 401);
    // }

    return student;
  }

  async createStudent(studentDto: CreateStudentDto, userId: number) {
    const { groups, ...restDto } = studentDto;

    // if (user_id != userId) {
    //   throw new HttpException('Unauthorized', 401);
    // }

    if (groups && Array.isArray(groups)) {
      const group_ids = groups.map((group_id) => ({ group_id: group_id }));

      const studentGroup = await this.prisma.students.create({
        data: {
          ...restDto,
          groups: { connect: group_ids },
        },
      });

      await Promise.all(
        group_ids.map(async (id) => {
          await this.prisma.student_group.create({
            data: {
              group_id: +id.group_id,
              student_id: +studentGroup.student_id,
            },
          });
        }),
      );
      return studentGroup;
    } else {
      return await this.prisma.students.create({ data: { ...restDto } });
    }
  }

  async updateStudent(
    id: number,
    studentDto: UpdateStudentDto,
    userId: number,
  ) {
    const { groups, ...restDto } = studentDto;

    const existingStudent = await this.prisma.students.findUnique({
      where: { student_id: +id },
      include: { groups: true },
    });

    if (!existingStudent) {
      throw new NotFoundException(`Can't find this student: ${id}`);
    }

    // if (!existingStudent.groups.some((group) => group.user_id === userId)) {
    //   throw new HttpException('Unauthorized', 401);
    // }

    if (groups && Array.isArray(groups)) {
      const group_ids = groups.map((group_id) => ({ group_id: group_id }));

      return await this.prisma.students.update({
        where: { student_id: +id },
        data: {
          ...restDto,
          groups: { set: group_ids },
        },
      });
    } else {
      return await this.prisma.students.update({
        where: { student_id: +id },
        data: { ...restDto },
      });
    }
  }

  async deleteStudent(id: number, user_id: number) {
    const student = await this.prisma.students.findUnique({
      where: { student_id: +id },
      include: {
        groups: {
          where: {
            user_id: +user_id,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Can't find this student : ${id}`);
    }

    if (!student.groups.some((group) => group.user_id === user_id)) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.prisma.students.delete({ where: { student_id: +id } });
  }
}
