/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersAuthService } from './users-auth.service';
import { AuthController } from './auth.controller';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { EmailConfirmationService } from './emailconfirmation.service';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300000s' },
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    UsersAuthService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailConfirmationService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
