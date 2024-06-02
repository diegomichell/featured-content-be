import BaseError from './BaseError';

export enum ValidationErrorCodes {
  MissingParameter,
}

export default class ValidationError extends BaseError {
  constructor(
    public message: string,
    public code: ValidationErrorCodes,
  ) {
    super(message);
  }
}
