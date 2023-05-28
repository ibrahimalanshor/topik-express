import { Service } from 'typedi';
import { RouterContext } from '../../common/app/response';
import { AuthService } from './auth.service';
import { AuthResult } from './auth.entity';
import autobind from 'autobind-decorator';
import { AuthenticationError } from '../../common/errors/auth-error';
import { UnauthorizedError } from '../../common/app/http-error/unauthorized.error';

@Service()
export class AuthController {
  constructor(public authService: AuthService) {}

  @autobind
  async login(context: RouterContext): Promise<AuthResult> {
    try {
      return await this.authService.login(context.req.body);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        throw new UnauthorizedError({}, err.message);
      }

      throw err;
    }
  }
}
