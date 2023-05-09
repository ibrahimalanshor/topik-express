import { BaseError } from '../error';

export class NotFoundError extends BaseError {
  constructor(errors: any = {}, message: string = '') {
    super(404, errors, message);
  }
}
