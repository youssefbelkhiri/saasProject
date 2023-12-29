import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';

@Module({
  controllers: [GradingController],
  providers: [GradingService]
})
export class GradingModule {}
