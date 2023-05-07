import { BaseError } from '../error';

export class UnprocessableEntityError extends BaseError {
  constructor(errors: any = {}, message: string = '') {
    super(422, errors, message);
  }
}
