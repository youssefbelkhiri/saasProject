import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudents(){
    return await this.prisma.students.findMany({})
  }

  async getStudent(id: number){
    const student = await this.prisma.students.findUnique({where: {student_id: +id}})
    if (!student) {
      throw new NotFoundException(`Can't find this student : ${id}`)
    }
    return student;
  }

  async createStudent(studentDto:  CreateStudentDto){
    const { groups, ...restDto } = studentDto;

    if (groups && Array.isArray(groups)) {
      const group_ids = groups.map(group_id => ({ group_id: group_id }));
  
      return await this.prisma.students.create({
        data: {
          ...restDto,
          groups: { connect: group_ids },
        },
      });
    } 
    else {
      return await this.prisma.students.create({ data: { ...restDto } }); 
    }
  }


  async updateStudent(id: number, studentDto: UpdateStudentDto){
    const { groups, ...restDto } = studentDto;
    
    if (groups && Array.isArray(groups)) {
      const group_ids = groups.map(group_id => ({ group_id: group_id }));

      return await this.prisma.students.update({
        where: { student_id: +id },
        data: {
          ...restDto,
          groups: { set: group_ids }, 
        },
      });
    }
    else {
      return await this.prisma.students.update({
        where: { student_id: +id },
        data: { ...restDto },
      });
    }
  }

  async deleteStudent(id: number){
    return await this.prisma.students.delete({where: {student_id: +id}})
  }

}
