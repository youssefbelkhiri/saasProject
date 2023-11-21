import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

