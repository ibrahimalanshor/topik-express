import { before, describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { CreateTopicDto } from '../../../src/modules/topic/dto/create-topic.dto';
import supertest from 'supertest';
import { server } from '../../../server';
import { TopicService } from '../../../src/modules/topic/topic.service';
import Container from 'typedi';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { AuthResult } from '../../../src/modules/auth/auth.entity';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { generateAuthTest } from '../../../src/common/test/it/auth.it';

describe('create topic test', () => {
  const topicService = Container.get(TopicService);
  const topicRepo = Container.get(TopicRepository);
  const authService = Container.get(AuthService);

  const requestOptions: { token: AuthResult } = {
    token: '',
  };

  before(async () => {
    requestOptions.token = await authService.login({ password: 'password' });
  });

  generateAuthTest('post', '/api/topics');

  describe('validation test', () => {
    const invalidPayload = {
      name: [],
    };

    it('should return validation schema error when object is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(CreateTopicDto);

      await expect(transformPayload(invalidPayload)).to.eventually.be.rejected;
    });

    it('it should return 422 when body request is invalid', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .send(invalidPayload)
        .expect(422);

      expect(res.body).to.have.property('errors').and.have.property('name');
    });
  });

  describe('creation test', () => {
    const payload = {
      name: 'test',
    };

    before(async () => {
      await topicRepo.delete();
    });

    it('should insert new topic', async () => {
      const topic = await topicService.create(payload);

      expect(topic).to.have.property('name').and.eql(payload.name);
    });

    it('should return 200 with stored topic', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .send(payload)
        .expect(200);

      expect(res.body)
        .to.have.property('data')
        .and.have.property('name')
        .and.eql(payload.name);
    });

    it('should return 200 with stored empty string topic', async () => {
      const payload = {
        name: '    ',
      };

      const res = await supertest(server.httpServer)
        .post('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .send(payload)
        .expect(200);

      expect(res.body)
        .to.have.property('data')
        .and.have.property('name')
        .and.equal('');
    });

    it('should return 200 with stored null topic', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .send()
        .expect(200);

      expect(res.body).to.have.property('data').and.have.property('name').and.be
        .null;
    });
  });
});
