import { PrismaClient } from "@prisma/client";
import { TodoService } from "./services/todo/service";

declare module 'fastify' {
  export interface FastifyInstance {
    db: PrismaClient
    todoService: TodoService
  }
}
