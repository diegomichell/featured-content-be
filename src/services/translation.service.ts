import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import ServerError from '../errors/ServerError';
import { SupportedLanguage, TranslationResponse } from '../types/translation';
import * as process from 'process';
import ValidationError, {
  ValidationErrorCodes,
} from '../errors/ValidationError';

@Injectable()
export class TranslationService {
  private httpClient: Axios;

  constructor() {
    this.httpClient = new Axios({
      baseURL: 'https://libretranslate.com',
    });
  }

  async getSupportedLanguages() {
    const res = await this.httpClient.get<SupportedLanguage[]>(`/languages`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return JSON.parse(res.data as any) as SupportedLanguage[];
  }

  async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) {
    if (!text) {
      return new ValidationError(
        '"text" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    if (!sourceLanguage) {
      return new ValidationError(
        '"sourceLanguage" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    if (!targetLanguage) {
      return new ValidationError(
        '"targetLanguage" param is required',
        ValidationErrorCodes.MissingParameter,
      );
    }

    const supportedLanguages = await this.getSupportedLanguages();
    const isSupportedLanguage = !!supportedLanguages.find(
      (item) => item.code === targetLanguage,
    );

    if (!isSupportedLanguage) {
      return new ValidationError(
        `"${targetLanguage}" is not a supported language`,
        ValidationErrorCodes.InvalidParameter,
      );
    }

    const res = await this.httpClient.post<TranslationResponse>(
      `/translate`,
      JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
        api_key: process.env.LIBRE_TRANSLATE_API_KEY,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.status != 200) {
      return new ServerError(
        'We got an error trying to contact the translation service, please try again later',
      );
    }

    return JSON.parse(res.data as any) as TranslationResponse;
  }
}
