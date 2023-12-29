import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GradingService } from './grading.service';
import { gradingDto } from './dto/grading.dto';
import { gradingGroupDto } from './dto/grading-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async gradPaper(@Body() gradingDto: gradingDto){
    return this.gradingService.gradPaper(gradingDto)
  }

  @Post("group")
  async gradGroup(@Body() gradingGroupDto: gradingGroupDto){
      return this.gradingService.gradGroup(gradingGroupDto)
  }
}
