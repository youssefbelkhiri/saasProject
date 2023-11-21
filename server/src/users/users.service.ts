import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({where: {id: +id}});

    if (!user) {
      throw new NotFoundException(`Can't find this user id : ${id}`)
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
    //TODO : MUST DELETE ROWS WITH RELATIONS WITH USER SUCH A EXAMS, PLAN...
    await this.prisma.user.delete({
      where: {
        id: +id,
      },
    });
  }
  

  

}
