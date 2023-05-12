import { describe, it, before, beforeEach } from 'mocha';
import supertest from 'supertest';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { DeleteTopicParamsDto } from '../../../src/modules/topic/dto/delete-topic.dto';
import { server } from '../../../server';
import Container from 'typedi';
import { TopicService } from '../../../src/modules/topic/topic.service';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { StoredTopic } from '../../../src/modules/topic/topic.entity';

describe.skip('delete topic test', () => {
  const topicService = Container.get(TopicService);
  const topicRepo = Container.get(TopicRepository);

  describe('invalid param test', () => {
    const invalidParams = {
      id: 'invalid',
    };
    it('should throw validation schema error when param is invalid', async () => {
      const transformParam =
        createObjectTransformerWithValidator(DeleteTopicParamsDto);

      await expect(transformParam(invalidParams)).to.eventually.be.rejected;
    });
    it('should return 404 param is invalid', async () => {
      await supertest(server.httpServer)
        .delete(`/api/topics/${invalidParams.id}`)
        .expect(404);
    });
  });
  describe('not found param test', () => {
    const params = {
      id: 999,
    };
    it('should throw empty result error when param is not found', async () => {
      await expect(topicService.delete(params)).to.eventually.be.rejected;
    });
    it('should return 404 when param is not found', async () => {
      await supertest(server.httpServer)
        .delete(`/api/topics/${params.id}`)
        .expect(404);
    });
  });
  describe('delete test', () => {
    const params: { topic?: StoredTopic } = {};

    before(async () => {
      await topicRepo.delete();
    });

    beforeEach(async () => {
      params.topic = await topicService.create({
        name: 'test',
      });
    });

    it('should delete topic by id', async () => {
      await expect(
        topicService.delete({
          id: params.topic?.id,
        })
      ).to.eventually.be.fulfilled;
    });
    it('should return 200', async () => {
      await supertest(server.httpServer)
        .delete(`/api/topics/${params.topic?.id}`)
        .expect(200);
    });
  });
});
