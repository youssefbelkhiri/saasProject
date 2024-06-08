/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id')
  async getUser(@Param('id') id: number, @Request() req) {
    const user = await this.userService.getUser(id);
    if (req.user.id === user.id) {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: number,
    @Request() req,
    @Body() userData: UpdateUserDto,
  ) {
    const user = await this.userService.getUser(id);

    if (req.user.id !== user.id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.userService.updateUser(id, userData);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number, @Request() req) {
    const user = await this.userService.getUser(id);

    if (req.user.id !== user.id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.userService.deleteUser(id);
  }
}
