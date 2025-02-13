import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from './todo.entity'
import { TodosController } from './todos.controller'
import { TodosService } from './todos.service'

@Module({
  imports: [TypeOrmModule.forFeature([Todo])], // 엔티티 삽이잇
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
