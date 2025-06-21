import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Todo } from './todo.entity'
import { Repository } from 'typeorm'
import { CreateTodoDto } from './dtos/create-todo.dto'
import { User } from '../users/user.entity'

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
  ) {}

  async findMany(boardId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [items, total] = await this.repo.findAndCount({
      where: { board: { id: boardId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['author'],
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  create(dto: CreateTodoDto, user: { userId: number }, boardId: number) {
    const todo = this.repo.create({
      ...dto,
      author: { id: user.userId },
      board: { id: boardId },
    })
    return this.repo.save(todo)
  }

  async update(id: number, dto: CreateTodoDto) {
    const todo = await this.repo.findOne({ where: { id } })
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`) // 또는 return
    }
    console.log('dto', dto)

    Object.assign(todo, dto)
    return await this.repo.save(todo)
  }

  async delete(id: number) {
    const todo = await this.repo.findOne({ where: { id } })
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`) // 또는 return
    }
    return await this.repo.remove(todo)
  }
}
