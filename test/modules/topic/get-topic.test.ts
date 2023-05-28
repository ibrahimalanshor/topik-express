import { expect } from '../../../src/common/test/chai';
import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { GetTopicDto } from '../../../src/modules/topic/dto/get-topic.dto';
import { server } from '../../../server';
import Container from 'typedi';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { TopicService } from '../../../src/modules/topic/topic.service';
import { CreateTopicDto } from '../../../src/modules/topic/dto/create-topic.dto';
import { generateFilterTest } from '../../../src/common/test/it/filter.it';
import { AuthResult } from '../../../src/modules/auth/auth.entity';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { generateAuthTest } from '../../../src/common/test/it/auth.it';

describe('get topic test', () => {
  const topicRepo = Container.get(TopicRepository);
  const topicService = Container.get(TopicService);
  const authService = Container.get(AuthService);

  const requestOptions: { token: AuthResult } = {
    token: '',
  };

  before(async () => {
    requestOptions.token = await authService.login({ password: 'password' });
  });

  generateAuthTest('get', '/api/topics');

  describe('validation test', () => {
    const invalidPayload = {
      name: ['invalid', 'invalid'],
    };

    it('should return validation schema error when object is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(GetTopicDto);

      await expect(transformPayload(invalidPayload)).to.eventually.be.rejected;
    });

    it('should return 400 when query request is invalid', async () => {
      const res = await supertest(server.httpServer)
        .get('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .query(invalidPayload)
        .expect(400);

      expect(res.body).to.have.property('errors').and.have.property('name');
    });
  });

  describe('get test', () => {
    const topics: CreateTopicDto[] = ['Test 1', 'Test 2', 'Test 3'].map(
      (it) => ({
        name: it,
      })
    );
    before(async () => {
      await topicRepo.delete();
      await topicService.create(topics);

      generateFilterTest(topicService.findAll.bind(topicService), {
        data: topics,
        id: 'name',
        endpoint: '/api/topics',
        token: requestOptions.token,
      });
    });

    it('should get all topics', async () => {
      const meta = {
        count: topics.length,
        limit: 10,
        offset: 10,
      };
      const res = await topicService.findAll();

      expect(res.meta).to.be.an('object').and.eql(meta);
      expect(res.data).to.be.an('array').and.have.length(topics.length);
    });

    it('should get all searched topics', async () => {
      const meta = {
        count: 1,
        limit: 10,
        offset: 10,
      };

      const search = topics[2].name;
      const res = await topicService.findAll({
        name: search,
      });

      expect(res.meta).to.eql(meta);
      expect(res.data).to.be.an('array').and.have.length(1);
      expect(res.data[0].name).to.equal(search);
    });

    it('should return 200 searched topics', async () => {
      const meta = {
        count: 1,
        limit: 10,
        offset: 10,
      };

      const search = topics[2].name;
      const res = await supertest(server.httpServer)
        .get('/api/topics')
        .set({
          authorization: requestOptions.token,
        })
        .query({
          name: search,
        })
        .expect(200);

      expect(res.body.data.meta).to.eql(meta);
      expect(res.body.data.data).to.be.an('array').and.have.length(1);
      expect(res.body.data.data[0].name).to.equal(search);
    });
  });
});
