import { FastifyInstance, FastifyReply } from "fastify";

export interface ICreateTodoBody {
  text: string;
}

export interface IUpdateTodoBody {
  text: string;
  done: boolean;
}

export interface ITodoByIdParams {
  id: string;
}

export async function todoRoutes(fastify: FastifyInstance) {
  // ToDo authentication here!
  //fastify.addHook('preHandler', fastify.authPreHandler)

  fastify.get("/", async (_, reply: FastifyReply) => {
    const todos = await fastify.todoService.getAllTodos();
    reply.send(todos);
  });

  fastify.post<{
    Body: ICreateTodoBody;
  }>("/", async (req, reply) => {
    const { text } = req.body;
    const todo = await fastify.todoService.createTodo(text);
    reply.send(todo);
  });

  fastify.put<{
    Body: IUpdateTodoBody;
    Params: ITodoByIdParams;
  }>("/:id", async (req, reply) => {
    const { id } = req.params;
    const { text, done } = req.body;
    console.log({ text, r: req });
    const todo = await fastify.todoService.updateTodo(id, text, done);
    reply.send(todo);
  });

  fastify.delete<{
    Params: ITodoByIdParams;
  }>("/:id", async (req, reply) => {
    const { id } = req.params;
    const todo = await fastify.todoService.deleteTodo(id);
    reply.send(todo);
  });
}
