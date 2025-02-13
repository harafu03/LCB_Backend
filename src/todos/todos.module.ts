import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from './todo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Todo])], // 엔티티 삽이잇
})
export class TodosModule {}
