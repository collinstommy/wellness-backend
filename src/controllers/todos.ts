import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ServerResponse } from 'http'
const prisma = new PrismaClient()


export interface ICreateTodoBody {
  text: string
}

export interface IUpdateTodoBody {
  text: string,
  done: boolean
}

export interface ITodoByIdParams {
  id: string
}

export const createTodo = async (req: {
  body: ICreateTodoBody
}, res: FastifyReply) => {
  const { text } = req.body
  const todos = await prisma.todo.create({
    data: {
      text
    }
  })
  res.send(todos)
}

export const getAllTodos = async (_: FastifyRequest, res: FastifyReply) => {
  const todos = await prisma.todo.findMany()
  res.send(todos)
}

export const updateTodo = async (req: {
  body: IUpdateTodoBody,
  params: ITodoByIdParams,
}, res: FastifyReply) => {
  const { text, done, } = req.body
  const { id } = req.params
  const todo = await prisma.todo.update({
    where: { id },
    data: {
      text: text || undefined,
      done: done || undefined,
    }
  })
  res.send(todo)
}

export const deleteTodo = async (req: {
  params: ITodoByIdParams
}, res: FastifyReply) => {
  const { id } = req.params
  const todo = await prisma.todo.delete({
    where: { id }
  })
  res.send(todo)
}
