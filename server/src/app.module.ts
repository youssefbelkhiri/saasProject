import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, QuestionsModule, ExamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
