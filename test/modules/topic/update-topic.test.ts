import { before, describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import {
  UpdateTopicParamsDto,
  UpdateTopicValuesDto,
} from '../../../src/modules/topic/dto/update-topic.dto';
import supertest from 'supertest';
import { server } from '../../../server';
import Container from 'typedi';
import { TopicService } from '../../../src/modules/topic/topic.service';
import { StoredTopic } from '../../../src/modules/topic/topic.entity';

describe.only('update topic test', () => {
  const topicService = Container.get(TopicService);

  describe('validation test', () => {
    it('should return validation error when object is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(UpdateTopicValuesDto);

      await expect(
        transformPayload({
          name: [],
        })
      ).to.eventually.be.rejected;
    });
    it('should return 422 when body is invalid', async () => {
      const res = await supertest(server.httpServer)
        .patch(`/api/topics/1`)
        .send({
          name: '    ',
        })
        .expect(422);

      expect(res.body).to.have.property('errors').and.have.property('name');
    });
  });

  describe('invalid id test', () => {
    it('should return empty result error when id is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(UpdateTopicParamsDto);

      await expect(
        transformPayload({
          id: 'invalid',
        })
      ).to.eventually.be.rejected;
    });

    it('should 404 when params id is invalid', async () => {
      await supertest(server.httpServer)
        .patch(`/api/topics/invalid`)
        .send({
          name: 'name',
        })
        .expect(404);
    });
  });

  describe('not found test', () => {
    it('should return empty result error when id is not exists', async () => {
      await expect(topicService.update({ id: 999 }, { name: 'test' })).to
        .eventually.be.rejected;
    });
    it('should return 404 when id is not exists', async () => {
      await supertest(server.httpServer)
        .patch('/api/topics/999')
        .send({ name: 'test' })
        .expect(404);
    });
  });

  describe('update test', () => {
    const test: { topic?: StoredTopic } = {};
    const payload = {
      name: 'Update',
    };

    before(async () => {
      test.topic = await topicService.create({
        name: 'Test',
      });
    });

    it('should success updated test', async () => {
      const res = await topicService.update({ id: test.topic?.id }, payload);

      expect(res.name).to.eql(payload?.name);
    });

    it('should 200 updated test', async () => {
      const res = await supertest(server.httpServer)
        .patch(`/api/topics/${test.topic?.id}`)
        .send(payload)
        .expect(200);

      expect(res.body.data.name).to.eql(payload?.name);
    });
  });
});
