import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FeedController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/feed/{language}/featured/{YYYY}/{MM}/{DD} (GET)', () => {
    return request(app.getHttpServer())
      .get('/feed/en/featured/2024/06/01')
      .expect(200);
  });

  it('/feed/{language}/featured/{YYYY}/{MM} (GET)', () => {
    return request(app.getHttpServer())
      .get('/feed/en/featured/2024/06')
      .expect(404);
  });

  it('/feed/{language}/featured/{YYYY} (GET)', () => {
    return request(app.getHttpServer())
      .get('/feed/en/featured/2024')
      .expect(404);
  });

  it('/feed/featured/{YYYY}/{MM}/{DD} (GET)', () => {
    return request(app.getHttpServer())
      .get('/feed/featured/2024/06/01')
      .expect(404);
  });

  it('/feed/{language}/featured/{invalid_year}/{MM}/{DD} (GET)', () => {
    return request(app.getHttpServer())
      .get('/feed/en/featured/20240000x02/06/01')
      .expect(500);
  });

  it('/feed/languages (GET)', () => {
    return request(app.getHttpServer()).get('/feed/languages').expect(200);
  });
});
