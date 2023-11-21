import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersAuthService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(user: RegisterDto) {
    return this.prisma.user.create({ data: user });
  }
}
