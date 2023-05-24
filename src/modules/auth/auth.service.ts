import { Service } from 'typedi';
import { verifyPassword } from '../../common/auth/password.helper';
import { AuthenticationError } from '../../common/errors/auth-error';
import { authConfig } from '../../config/auth.config';
import { AuthResult } from './auth.entity';
import { LoginDto } from './dto/login.dto';
import { getString } from '../../common/resource/get-string';
import { generateToken } from '../../common/auth/token.helper';

@Service()
export class AuthService {
  async login(credential: LoginDto): Promise<AuthResult> {
    if (!(await verifyPassword(credential.password, authConfig.password))) {
      throw new AuthenticationError(
        getString('auth.error.incorrect-credential') as string
      );
    }

    return {
      accessToken: await generateToken(
        authConfig.key,
        { type: 'access-token' },
        { expire: '15m' }
      ),
      refreshToken: await generateToken(
        authConfig.key,
        { type: 'refresh-token' },
        { expire: '30d' }
      ),
    };
  }
}
