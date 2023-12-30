/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsControllers } from './reports.controller';

@Module({
  imports: [],
  controllers: [ReportsControllers],
  providers: [ReportsService],
})
export class ReportsModule {}
