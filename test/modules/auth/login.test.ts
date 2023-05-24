import { describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import supertest from 'supertest';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { server } from '../../../server';
import Container from 'typedi';
import { AuthService } from '../../../src/modules/auth/auth.service';

describe.only('login test', () => {
  const authService = Container.get(AuthService);

  describe('validation test', () => {
    const invalidCredential = {
      password: '',
    };

    it('should throw error when credential is invalid', async () => {
      const transformPayload = createObjectTransformerWithValidator(LoginDto);

      await expect(transformPayload(invalidCredential)).to.eventually.be
        .rejected;
    });
    it('should return 422 when credential is invalid', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/login')
        .send(invalidCredential)
        .expect(422);

      expect(res.body)
        .to.have.property('errors')
        .and.be.an('object')
        .and.have.property('password');
    });
  });

  describe('incorrect credential test', () => {
    const incorrectCredential = {
      password: 'incorrect',
    };

    it('should throw error when credential is incorrect', async () => {
      await expect(authService.login(incorrectCredential)).to.eventually.be
        .rejected;
    });
    it('should return 401 when credential is incorrect', async () => {
      await supertest(server.httpServer)
        .post('/api/login')
        .send(incorrectCredential)
        .expect(401);
    });
  });

  describe('login test', () => {
    const credential = {
      password: 'password',
    };

    it('should return auth result', async () => {
      const res = await authService.login(credential);

      expect(res).to.be.an('object');
      expect(res).to.have.property('accessToken');
      expect(res).to.have.property('refreshToken');
    });
    it('should return 200 and auth result', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/login')
        .send(credential)
        .expect(200);

      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('accessToken');
      expect(res.body.data).to.have.property('refreshToken');
    });
  });
});
