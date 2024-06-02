import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { WikipediaService } from '../services/wikipedia.service';
import ValidationError from '../errors/ValidationError';
import ServerError from '../errors/ServerError';
import { Response } from 'express';
import { TranslationService } from '../services/translation.service';
import { FeedResponse } from '../types/wikipedia';

@Controller()
export class FeedController {
  constructor(
    private readonly wikipediaService: WikipediaService,
    private readonly translationService: TranslationService,
  ) {}

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

  @Get('/feed/translate/:language/featured/:year/:month/:day/:targetLanguage')
  @Header('Content-Type', 'application/json')
  async getTranslatedFeed(
    @Param('language') language: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
    @Param('targetLanguage') targetLanguage: string,
    @Res() res: Response,
  ) {
    const feedResult = await this.wikipediaService.getFeed(language, {
      year,
      month,
      day,
    });

    if (feedResult instanceof ValidationError) {
      return res.status(400).send(feedResult);
    }

    if (feedResult instanceof ServerError) {
      return res.status(500).send(feedResult);
    }

    const translatedFeed = feedResult as FeedResponse;

    if (translatedFeed.image?.description?.text) {
      const result = await this.translationService.translateText(
        translatedFeed.image.description.text!,
        language,
        targetLanguage,
      );

      if (result instanceof ValidationError) {
        return res.status(400).send(result);
      }

      if (result instanceof ServerError) {
        return res.status(500).send(result);
      }

      translatedFeed.image.description.text = result.translatedText;
    }

    for (const article of translatedFeed?.mostread?.articles || []) {
      const articleTitleTranslationResult =
        await this.translationService.translateText(
          article.titles.normalized,
          language,
          targetLanguage,
        );

      if (articleTitleTranslationResult instanceof ValidationError) {
        return res.status(400).send(articleTitleTranslationResult);
      }

      if (articleTitleTranslationResult instanceof ServerError) {
        return res.status(500).send(articleTitleTranslationResult);
      }

      const articleExtractTranslationResult =
        await this.translationService.translateText(
          article.extract,
          language,
          targetLanguage,
        );

      if (articleExtractTranslationResult instanceof ValidationError) {
        return res.status(400).send(articleExtractTranslationResult);
      }

      if (articleExtractTranslationResult instanceof ServerError) {
        return res.status(500).send(articleExtractTranslationResult);
      }

      article.titles.normalized = articleTitleTranslationResult.translatedText;
      article.extract = articleExtractTranslationResult.translatedText;
    }

    return res.status(200).send(translatedFeed);
  }

  @Get('/feed/languages')
  @Header('Content-Type', 'application/json')
  async getSupportedLanguages() {
    return await this.translationService.getSupportedLanguages();
  }
}
