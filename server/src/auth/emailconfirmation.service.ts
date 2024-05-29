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
  
  async sendVerificationLink(email: string) {
    const token = await this.generateVerificationToken(email);
    const confirmationLink = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    
    const htmlContent = `
      <p>To confirm your email, click the button below:</p>
      <a href="${confirmationLink}" style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
    `;

    await this.emailService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      html: htmlContent,
    });
  }

  async generateVerificationToken(email: string) {
    const payload = { emailver: email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
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
