/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
} from '@nestjs/common';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { loginDto } from './auth/dto/login.dto';
@Controller('api')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() body) {
    return this.authService.register(body);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body(new ValidationPipe()) { email, password }: loginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
