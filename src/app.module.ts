import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './services/database.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { WikipediaService } from './services/wikipedia.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [FeedController],
  providers: [WikipediaService, DatabaseService],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(protected databaseService: DatabaseService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  onModuleInit() {
    this.databaseService.syncDb();
  }
}
