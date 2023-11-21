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
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new ValidationPipe()) { email, password }: loginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
