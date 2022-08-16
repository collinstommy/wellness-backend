import { PrismaClient } from "@prisma/client";

export class TodoService {
  prisma: PrismaClient;
  constructor(db: PrismaClient) {
    this.prisma = db;
  }

  async createTodo(text: string) {
    return this.prisma.todo.create({
      data: {
        text,
        userId: "1",
      },
    });
  }

  async getAllTodos() {
    return this.prisma.todo.findMany();
  }

  async updateTodo(id: string, text: string, done: boolean) {
    return this.prisma.todo.update({
      where: { id },
      data: {
        text: text || undefined,
        done,
      },
    });
  }

  async deleteTodo(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
