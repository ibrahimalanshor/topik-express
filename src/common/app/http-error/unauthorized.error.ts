import { BaseError } from '../error';

export class UnauthorizedError extends BaseError {
  constructor(errors: any = {}, message: string = '') {
    super(401, errors, message);
  }
}
