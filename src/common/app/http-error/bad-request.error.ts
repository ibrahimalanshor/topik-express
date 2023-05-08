import { BaseError } from '../error';

export class BadRequestError extends BaseError {
  constructor(errors: any = {}, message: string = '') {
    super(400, errors, message);
  }
}
