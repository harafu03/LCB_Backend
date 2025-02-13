import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dtos/create-todo.dto'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findMany() {
    return this.todosService.findMany()
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CreateTodoDto) {
    return this.todosService.update(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.todosService.delete(id)
  }
}
