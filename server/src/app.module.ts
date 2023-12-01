import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamModule } from './exam/exam.module';
import { GroupsModule } from './groups/groups.module';
import { StudentsModule } from './students/students.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, QuestionsModule, ExamModule, EmailModule, GroupsModule, StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
