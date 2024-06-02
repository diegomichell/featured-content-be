import { Injectable } from '@nestjs/common';
import { FeedResponse, WikipediaDateParam } from '../types/wikipedia';
import { Axios } from 'axios';
import ValidationError, {
  ValidationErrorCodes,
} from '../errors/ValidationError';
import ServerError from '../errors/ServerError';
import { padNumber } from '../utils';

@Injectable()
export class WikipediaService {
  private httpClient: Axios;

  constructor() {
    this.httpClient = new Axios({
      baseURL: 'https://api.wikimedia.org',
    });
  }

  async getFeed(language: string, date: WikipediaDateParam) {
    if (!language) {
      return new ValidationError(
        '"language" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    if (!date.year) {
      return new ValidationError(
        '"year" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    if (!date.month) {
      return new ValidationError(
        '"month" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    if (!date.day) {
      return new ValidationError(
        '"day" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    const res = await this.httpClient.get<FeedResponse>(
      `/feed/v1/wikipedia/${language}/featured/${date.year}/${padNumber(date.month)}/${padNumber(date.day)}`,
    );

    if (res.status != 200) {
      return new ServerError(
        'We got an error trying to contact the feeds service, please try again later',
      );
    }

    return res.data;
  }
}
