// src/todo/todo.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import * as qs from 'qs';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: Request) {
    const rawQuery = req.url.split('?')[1] || '';
    const parsedQuery = qs.parse(rawQuery);
    return this.todoService.getAll(parsedQuery);
  }

  @Post()
  create(@Body('title') title: string) {
    return this.todoService.create(title);
  }

  @Post(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.todoService.toggle(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('title') title: string) {
    return this.todoService.update(+id, title);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(+id);
  }
}
