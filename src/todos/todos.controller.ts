import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dtos/create-todo.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('boards/:boardId/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findMany(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.todosService.findMany(boardId, page, limit)
  }

  @Post()
  create(
    @Body() body: CreateTodoDto,
    @Request() req,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.todosService.create(body, req.user, boardId)
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
