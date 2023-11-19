import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { GenQuestionsService } from './generator/gen-questions.service';
import { SecondaryGeneratorService } from './generator/secondary-generator.service';

@Module({
  imports: [PrismaModule],
  providers: [QuestionsService, GenQuestionsService, SecondaryGeneratorService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}

