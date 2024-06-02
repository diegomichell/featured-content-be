export interface TranslationResponse {
  detectedLanguage: DetectedLanguage;
  translatedText: string;
}

export interface DetectedLanguage {
  confidence: number;
  language: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  targets: string[];
}
