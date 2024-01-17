import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-groupe.dto';
import { UpdateGroupDto } from './dto/update-groupe.dto';


@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroups(id: number){
    return await this.prisma.groups.findMany({
      where: { user_id: +id },
      include: {students: true}
    })
  }

  async getGroup(id: number){
    const group = await this.prisma.groups.findUnique({where: {group_id: +id},  include: {students: true}})
    if(!group){
      throw new NotFoundException(`Can't find this group id : ${id}`)
    }
    return group
  }

  async createGroup(groupDto: CreateGroupDto) {
    const { students, ...restDto } = groupDto; 

    if (students && Array.isArray(students)) {
      const students_ids = students.map(student_id => ({ student_id: student_id }));
  

      const group = await this.prisma.groups.create({
        data: {
          ...restDto,
          students: { connect: students_ids },
        },
      });

      await Promise.all(
        students_ids.map(async (id) => {
          await this.prisma.student_group.create({
            data: {
              group_id: group.group_id, 
              student_id: +id.student_id,
            },
          });
        })
      );
      return group;
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
