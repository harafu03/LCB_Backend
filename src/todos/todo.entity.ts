import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'
import { Board } from '../boards/board.entity'
import { User } from '../users/user.entity'

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string
  @Column()
  content: string
  @CreateDateColumn()
  createdAt: Date
  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  board: Board
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User
}
