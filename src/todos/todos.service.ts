import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Todo } from './todo.entity'
import { Repository } from 'typeorm'
import { CreateTodoDto } from './dtos/create-todo.dto'

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async create(dto: CreateTodoDto) {
    const todo = this.todoRepository.create(dto)
    return await this.todoRepository.save(todo)
  }

  async findMany() {
    return await this.todoRepository.find()
  }

  async update(id: number, dto: CreateTodoDto) {
    const todo = await this.todoRepository.findOne({ where: { id } })
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`) // 또는 return
    }
    console.log('dto', dto)

    Object.assign(todo, dto)
    return await this.todoRepository.save(todo)
  }

  async delete(id: number) {
    const todo = await this.todoRepository.findOne({ where: { id } })
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`) // 또는 return
    }
    return await this.todoRepository.remove(todo)
  }
}
