import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { WikipediaService } from '../services/wikipedia.service';
import { Response } from 'express';
import ValidationError from '../errors/ValidationError';
import ServerError from '../errors/ServerError';
import { Axios } from 'axios';
import Mock = jest.Mock;

class ResponseClass {
  send(data: any) {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  status(code: number) {
    return this;
  }
}

jest.mock('axios');
jest.mock('axios', () => {
  class AxiosMock {
    constructor() {}

    get() {
      return {
        status: 200,
        data: require('../../mocks/mock-feed.json'),
      };
    }
  }

  return {
    Axios: AxiosMock,
  };
});

describe('FeedController', () => {
  let appController: FeedController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [WikipediaService],
    }).compile();

    appController = app.get<FeedController>(FeedController);
  });

  it('should return a valid response', async () => {
    const res = await appController.getFeed(
      'en',
      2024,
      6,
      1,
      new ResponseClass() as Response,
    );

    expect(res).not.toBeInstanceOf(ValidationError);
    expect(res).not.toBeInstanceOf(ServerError);
  });

  it('should return missing year param validation error', async () => {
    const res = await appController.getFeed(
      'en',
      null,
      6,
      1,
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ValidationError);
    expect(res).toEqual({ code: 0, message: '"year" param is required' });
  });

  it('should return missing month param validation error', async () => {
    const res = await appController.getFeed(
      'en',
      2024,
      null,
      1,
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ValidationError);
    expect(res).toEqual({ code: 0, message: '"month" param is required' });
  });

  it('should return missing day param validation error', async () => {
    const res = await appController.getFeed(
      'en',
      2024,
      6,
      null,
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ValidationError);
    expect(res).toEqual({ code: 0, message: '"day" param is required' });
  });

  it('should return server error if feed service is down', async () => {
    jest.spyOn(Axios.prototype, 'get');
    (Axios.prototype.get as Mock).mockResolvedValueOnce({
      status: 400,
    });

    const res = await appController.getFeed(
      'en',
      2024,
      6,
      1,
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ServerError);
  });
});
