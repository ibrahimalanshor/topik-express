import Container from 'typedi';
import { createBodyValidator } from '../../common/app/middlewares/request.middleware';
import { createJsonResponse } from '../../common/app/response';
import { createRoute } from '../../common/app/router';
import { AuthController } from './auth.controller';
import { LoginDto } from './dto/login.dto';

export const authRoute = createRoute<AuthController>(
  Container.get(AuthController)
)
  .post('/api/login', (controller: AuthController) => [
    createBodyValidator(LoginDto),
    createJsonResponse(controller.login),
  ])
  .getRouter();
