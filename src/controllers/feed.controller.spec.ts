import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { WikipediaService } from '../services/wikipedia.service';
import { Response } from 'express';
import ValidationError, {
  ValidationErrorCodes,
} from '../errors/ValidationError';
import ServerError from '../errors/ServerError';
import { Axios } from 'axios';
import Mock = jest.Mock;
import { TranslationService } from '../services/translation.service';

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

    get(url: string) {
      if (url.startsWith('/feed/v1/wikipedia')) {
        return {
          status: 200,
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          data: JSON.stringify(require('../../mocks/feed-response.json')),
        };
      }

      return {
        status: 200,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        data: JSON.stringify(require('../../mocks/languages-response.json')),
      };
    }

    post() {
      return {
        status: 200,
        data: JSON.stringify({
          detectedLanguage: {
            confidence: 90,
            language: 'es',
          },
          translatedText: 'Some text',
        }),
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
      providers: [WikipediaService, TranslationService],
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
    expect(res).toEqual({
      code: ValidationErrorCodes.MissingParameter,
      message: '"year" param is required',
    });
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
    expect(res).toEqual({
      code: ValidationErrorCodes.MissingParameter,
      message: '"month" param is required',
    });
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
    expect(res).toEqual({
      code: ValidationErrorCodes.MissingParameter,
      message: '"day" param is required',
    });
  });

  it('should return server error if feed service is down', async () => {
    jest.spyOn(Axios.prototype, 'get');
    (Axios.prototype.get as Mock).mockResolvedValueOnce({
      status: 500,
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

  it('should return targetLanguage param validation error', async () => {
    const res = await appController.getTranslatedFeed(
      'en',
      2024,
      6,
      1,
      null,
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ValidationError);
    expect(res).toEqual({
      code: ValidationErrorCodes.MissingParameter,
      message: '"targetLanguage" param is required',
    });
  });

  it('should return not supported targetLanguage validation error', async () => {
    const res = await appController.getTranslatedFeed(
      'en',
      2024,
      6,
      1,
      'XRZ2024',
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ValidationError);
    expect(res).toEqual({
      code: ValidationErrorCodes.InvalidParameter,
      message: '"XRZ2024" is not a supported language',
    });
  });

  it('should return server error if translation service is down', async () => {
    jest.spyOn(Axios.prototype, 'post');
    (Axios.prototype.post as Mock).mockResolvedValueOnce({
      status: 500,
    });

    const res = await appController.getTranslatedFeed(
      'en',
      2024,
      6,
      1,
      'es',
      new ResponseClass() as Response,
    );

    expect(res).toBeInstanceOf(ServerError);
  });

  it('should return supported languages', async () => {
    const res = await appController.getSupportedLanguages();

    expect(res).not.toBe(null);
    expect(res).toBeInstanceOf(Array);
  });
});
