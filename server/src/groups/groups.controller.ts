/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-groupe.dto';
import { UpdateGroupDto } from './dto/update-groupe.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getGroups(@Request() req) {
    return await this.groupsService.getGroups(req.user.id);
  }

  @Get('/:id')
  async getGroup(@Param('id') id: number, @Request() req) {
    const userGroup = await this.groupsService.getGroup(id);

    if (req.user.id === userGroup.user_id) {
      return userGroup;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }

  @Post()
  async createGroup(@Body() groupDto: CreateGroupDto, @Request() req) {
    return await this.groupsService.createGroup(groupDto, req.user.id);
  }

  @Patch('/:id')
  async updateGroup(
    @Param('id') id: number,
    @Body() groupDto: UpdateGroupDto,
    @Request() req,
  ) {
    const userGroup = await this.groupsService.getGroup(id);

    if (req.user.id !== userGroup.user_id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.groupsService.updateGroup(id, groupDto);
  }

  @Delete('/:id')
  async deleteGroup(@Param('id') id: number, @Request() req) {
    const userGroup = await this.groupsService.getGroup(id);

    if (req.user.id !== userGroup.user_id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.groupsService.deleteGroup(id);
  }
}
