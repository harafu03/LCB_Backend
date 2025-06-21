import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);

  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = this.boardsRepository.create(createBoardDto);
    return this.boardsRepository.save(board);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ items: Board[], total: number }> {
    const [items, total] = await this.boardsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    return { items, total };
  }

  findOne(id: number): Promise<Board | null> {
    return this.boardsRepository.findOneBy({ id });
  }

  async seedInitialBoards() {
    const initialBoards = [
      { name: '야구갤', description: '국내 야구에 대한 이야기를 나누는 곳' },
      { name: '축구갤', description: '해외 축구, 국내 축구 모든 주제 환영' },
    ];

    for (const boardData of initialBoards) {
      const boardExists = await this.boardsRepository.findOneBy({ name: boardData.name });
      if (!boardExists) {
        this.logger.log(`Seeding initial board: ${boardData.name}`);
        const board = this.boardsRepository.create(boardData);
        await this.boardsRepository.save(board);
      }
    }
  }
} 