import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { BoardsService } from './boards/boards.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  // Seed the database with initial boards
  const boardsService = app.get(BoardsService)
  await boardsService.seedInitialBoards()

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
