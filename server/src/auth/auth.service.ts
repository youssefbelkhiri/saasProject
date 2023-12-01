/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthEntity } from './entity/auth.entity';
import { PrismaService } from './../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UsersAuthService } from './users-auth.service';
import { EmailConfirmationService } from './emailconfirmation.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UsersAuthService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailConfirmationService: EmailConfirmationService,
    private configService: ConfigService,
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
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new UnauthorizedException('Invalid password');
    }
    const isEmailConfirmed =
      await this.emailConfirmationService.isEmailConfirmed(email);
    if (!isEmailConfirmed) {
      throw new BadRequestException('Email is not confirmed');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      accesToken: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
  public getCookieWithJwtToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
    )}`;
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
