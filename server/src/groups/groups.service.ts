import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-groupe.dto';
import { UpdateGroupDto } from './dto/update-groupe.dto';


@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroups(){
    return await this.prisma.groups.findMany({})
  }

  async getGroup(id: number){
    const group = await this.prisma.groups.findUnique({where: {group_id: +id}})
    if(!group){
      throw new NotFoundException(`Can't find this group id : ${id}`)
    }
    return group
  }

  async createGroup(groupDto: CreateGroupDto) {
    const { students, ...restDto } = groupDto; 

    if (students && Array.isArray(students)) {
      const students_ids = students.map(student_id => ({ student_id: student_id }));
  
      return await this.prisma.groups.create({
        data: {
          ...restDto,
          students: { connect: students_ids },
        },
      });
    } 
    else {
      return await this.prisma.groups.create({ data: { ...restDto } }); 
    }
  }


  async updateGroup(id: number, groupDto:  UpdateGroupDto){
    const { students, ...restDto } = groupDto; 

    if (students && Array.isArray(students)) {
      const students_ids = students.map(student_id => ({ student_id: student_id }));

      return await this.prisma.groups.update({
        where: { group_id: +id },
        data: {
          ...restDto,
          students: { set: students_ids }, 
        },
      });
    }
    else {
      return await this.prisma.groups.update({
        where: { group_id: +id },
        data: { ...restDto },
      });
    }

  }

  async deleteGroup(id: number){
    return await this.prisma.groups.delete({where: {group_id: +id}})
  }

}
