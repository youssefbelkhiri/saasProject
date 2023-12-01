import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamModule } from './exam/exam.module';
import { GroupsService } from './groups/groups.service';
import { StudentsService } from './students/students.service';
import { GroupsController } from './groups/groups.controller';
import { GroupsModule } from './groups/groups.module';
import { StudentsModule } from './students/students.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, QuestionsModule, ExamModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
