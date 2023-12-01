/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersAuthService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(user: RegisterDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
    if (created) {
      console.log(created);
      return { message: 'you can login now after confirmed your email ' };
    }
    return { message: 'error' };
  }
  async cofirmeEmail(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: { isEmailConfirmed: true },
    });
  }
}
