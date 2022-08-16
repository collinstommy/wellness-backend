import { FastifyInstance, RequestGenericInterface } from 'fastify'
import { createTodo, ICreateTodoBody, ITodoByIdParams, updateTodo, IUpdateTodoBody, deleteTodo, getAllTodos } from './controllers/todos'


interface ByIdRequest extends RequestGenericInterface {
  Params: ITodoByIdParams
}

export async function todoRoutes (fastify: FastifyInstance) {
  fastify.get('/todos', getAllTodos)
  
  fastify.post<{
    Body: ICreateTodoBody
  }>('/todos', createTodo)

  fastify.put<{
    Params: ITodoByIdParams,
    Body: IUpdateTodoBody
  }>('/todos/:id', updateTodo)

  fastify.delete<ByIdRequest>('/todos/:id', deleteTodo)
}
