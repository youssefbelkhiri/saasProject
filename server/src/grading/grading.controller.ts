import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { GradingService } from './grading.service';
import { gradingDto } from './dto/grading.dto';
import { gradingGroupDto } from './dto/grading-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Post()
  async gradPaper(@Body() gradingDto: gradingDto, @Request() req){
    return this.gradingService.gradPaper(gradingDto, req.user.id)
  }

  @Post("group")
  async gradGroup(@Body() gradingGroupDto: gradingGroupDto, @Request() req){
      return this.gradingService.gradGroup(gradingGroupDto, req.user.id)
  }
}
