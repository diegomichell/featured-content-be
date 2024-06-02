import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service';
import { isTestEnv } from '../utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(protected databaseService: DatabaseService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (isTestEnv()) {
      next();
      return;
    }

    res.on('finish', () => {
      try {
        this.databaseService.getLoggerModel().create({
          method: req.method,
          path: req.url,
          headers: req.headers,
          resStatusCode: res.statusCode,
        });
      } catch (e) {
        console.error(e);
      }
    });

    if (next) {
      next();
    }
  }
}
