/* eslint-disable prettier/prettier */
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: +id } });

    if (!user) {
      throw new NotFoundException(`Can't find this user id : ${id}`);
    }

    return user;
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: +id },
      data: userData,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Can't find this user id : ${id}`);
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
      include: {
        exams: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
            studentPapers: true,
          },
        },
        groups: {
          include: {
            students: true,
            exam: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new Error(`User with id ${id} not found.`);
    }
  

    if(user.exams){
      for (const exam of user.exams || []) {
        for (const question of exam.questions || []) {
          await this.prisma.options.deleteMany({
            where: {
              questionId: question.question_id,
            },
          });
    
          await this.prisma.questions.delete({
            where: {
              question_id: question.question_id,
            },
          });
        }
    
        await this.prisma.papers.deleteMany({
          where: {
            exam_id: exam.exam_id,
          },
        });
    
        await this.prisma.exam.delete({
          where: {
            exam_id: exam.exam_id,
          },
        });
      }
    }
    
    if(user.groups){
      for (const group of user.groups || []) {
        for (const student of group.students || []) {
          await this.prisma.student_group.deleteMany({
            where: {
              student_id: student.student_id,
            },
          });
        }
    
        for (const exam of group.exam || []) {
          await this.prisma.exam.delete({
            where: {
              exam_id: exam.exam_id,
            },
          });
        }
    
        await this.prisma.groups.delete({
          where: {
            group_id: group.group_id,
          },
        });
      }  
    }
    
    await this.prisma.user.delete({
      where: {
        id: +id,
      },
    });
  }
  
}
