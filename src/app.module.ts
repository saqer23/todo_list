import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TodoService } from './todo/todo.service';
import { TodoController } from './todo/todo.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [TodoController],
  providers: [TodoService, PrismaService],
})
export class AppModule {}
