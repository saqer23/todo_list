/* eslint-disable prettier/prettier */
import { Todo } from '@prisma/client';
export interface FindAllData {
  status: boolean;
  data: {
    info: Todo[];
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateData {
  status: boolean;
  data: Todo;
}

export interface FindOneData {
  status: boolean;
  data: Todo;
}

export interface DeleteData {
  status: boolean;
  title: string;
}
