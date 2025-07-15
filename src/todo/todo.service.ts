/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/todo/todo.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FindAllData,
  CreateData,
  FindOneData,
  DeleteData,
} from '../types/todo/todo.type';
import convertEqualsToInt from '../utility/convertToInt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(filter: Record<string, any>): Promise<FindAllData> {
    try {
      const { page, pageSize } = filter;
      const { orderBy } = filter;
      delete filter.orderBy;
      delete filter.page;
      delete filter.pageSize;
      delete filter.include;
      const convertString = convertEqualsToInt(filter);
      filter = convertString;
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const data = await this.prisma.todo.findMany({
          where: filter,
          orderBy,
          skip: +skip,
          take: +take,
        });
        const total = await this.prisma.todo.count({
          where: filter,
        });
        return {
          status: true,
          data: {
            info: data,
            total: +total,
            page: +page,
            pageSize: +pageSize,
          },
        };
      }
      const data = await this.prisma.todo.findMany({
        where: filter,
        orderBy,
      });
      const total = await this.prisma.todo.count({
        where: filter,
      });
      return {
        status: true,
        data: {
          info: data,
          total: +total,
          page: 1,
          pageSize: +total,
        },
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async create(title: string): Promise<CreateData> {
    try {
      const todo = await this.prisma.todo.create({
        data: { title },
      });
      return {
        status: true,
        data: todo,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async toggle(id: number): Promise<FindOneData> {
    try {
      const todo = await this.prisma.todo.findUnique({ where: { id } });
      if (!todo) {
        throw new HttpException('Todo Not Found', HttpStatus.NOT_FOUND);
      }
      const updatedTodo = await this.prisma.todo.update({
        where: { id },
        data: { completed: !todo.completed },
      });
      return {
        status: true,
        data: updatedTodo,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, title: string): Promise<FindOneData> {
    try {
      const todo = await this.prisma.todo.findUnique({ where: { id } });
      if (!todo) {
        throw new Error('Todo not found');
      }
      const updatedTodo = await this.prisma.todo.update({
        where: { id },
        data: { title: title },
      });
      return {
        status: true,
        data: updatedTodo,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: number): Promise<DeleteData> {
    try {
      const todo = await this.prisma.todo.findUnique({ where: { id } });
      if (!todo) {
        throw new Error('Todo not found');
      }
      const title = todo.title;
      await this.prisma.todo.delete({ where: { id } });
      return {
        status: true,
        title,
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
