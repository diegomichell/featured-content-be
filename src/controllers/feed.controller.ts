import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { WikipediaService } from '../services/wikipedia.service';
import ValidationError from '../errors/ValidationError';
import ServerError from '../errors/ServerError';
import { Response } from 'express';

@Controller()
export class FeedController {
  constructor(private readonly wikipediaService: WikipediaService) {}

  @Get('/feed/:language/featured/:year/:month/:day')
  @Header('Content-Type', 'application/json')
  async getFeed(
    @Param('language') language: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
    @Res() res: Response,
  ) {
    const result = await this.wikipediaService.getFeed(language, {
      year,
      month,
      day,
    });

    if (result instanceof ValidationError) {
      return res.status(400).send(result);
    }

    if (result instanceof ServerError) {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  }
}
