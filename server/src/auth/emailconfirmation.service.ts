/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UsersAuthService } from './users-auth.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private usersAuthService: UsersAuthService,
  ) {}
  public async confirmEmail(email: string) {
    if (!this.isEmailConfirmed(email)) {
      throw new BadRequestException('email is already confirmed');
    }
    return await this.usersAuthService.cofirmeEmail(email);
  }
  public async decodeToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (typeof payload === 'object' && 'emailver' in payload) {
        return payload.emailver;
      }

      throw new BadRequestException('Invalid payload');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expired');
      }
      console.log(error.name);
      throw new BadRequestException('Bad confirmation token');
    }
  }
  public sendVerificationLink(emailver: string) {
    const payload = { emailver };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const text = `to confirm your email click here:<a href=${url}/>`;
    return this.emailService.sendMail({
      to: emailver,
      subject: 'email confirmation',
      text,
    });
  }
  async isEmailConfirmed(email: string) {
    const user = await this.usersAuthService.findOne(email);
    if (user.isEmailConfirmed) {
      return true;
    }
    return false;
  }
}
