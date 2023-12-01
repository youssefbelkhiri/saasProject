import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
  Res,
} from '@nestjs/common';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailConfirmationService } from './emailconfirmation.service';
import ConfirmEmailDto from './dto/confirmeEmail.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const confirmed = await this.emailConfirmationService.sendVerificationLink(
      body.email,
    );
    if (confirmed) {
      return this.authService.register(body);
    }
    return { message: 'email unsent' };
  }
  @Post(`confirmEmail`)
  async confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeToken(
      confirmEmailDto.token,
    );
    return this.emailConfirmationService.confirmEmail(email);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new ValidationPipe()) { email, password }: loginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req, @Res() response) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Res() response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
