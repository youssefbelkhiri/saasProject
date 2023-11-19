import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthEntity } from './entity/auth.entity';
import { PrismaService } from './../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userservice.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async register(data: RegisterDto): Promise<any> {
    const user = await this.userservice.findOne(data.email);
    if (user) {
      return {
        message: 'users already exists',
      };
    }
    return this.userservice.create(data);
  }
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    if (!(user.password === password)) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      accesToken: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
