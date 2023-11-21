import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    return await this.userService.getUser(id);
  }

  @Patch("/:id")
  async updateUser(@Param('id') id: number,@Body() userData: UpdateUserDto){
    return await this.userService.updateUser(id,userData);
  }

  @Delete("/:id")
  async deleteUser(@Param('id') id: number){
    return await this.userService.deleteUser(id);
  }

}
