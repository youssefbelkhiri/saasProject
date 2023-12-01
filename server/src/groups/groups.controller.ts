import { Controller, Get, Post,Patch, Delete, Param, Body } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Prisma } from '@prisma/client';
import { CreateGroupDto } from './dto/create-groupe.dto';
import { UpdateGroupDto } from './dto/update-groupe.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getGroups(){
    return await this.groupsService.getGroups()
  }

  @Get("/:id")
  async getGroup(@Param("id") id: number){
    return await this.groupsService.getGroup(id)
  }

  @Post()
  async createGroup(@Body() groupDto: CreateGroupDto){
    return await this.groupsService.createGroup(groupDto)
  }

  @Patch("/:id")
  async updateGroup(@Param("id") id: number, @Body() groupDto: UpdateGroupDto){
    return await this.groupsService.updateGroup(id, groupDto)
  }

  @Delete("/:id")
  async deleteGroup(@Param("id") id: number){
    return await this.groupsService.deleteGroup(id)
  }
}
