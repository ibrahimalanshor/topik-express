import { expect } from '../../../src/common/test/chai';
import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import Container from 'typedi';
import { server } from '../../../server';
import { StoredTopic } from '../../../src/modules/topic/topic.entity';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { TopicService } from '../../../src/modules/topic/topic.service';

describe('find topic test', () => {
  const topicService = Container.get(TopicService);
  const topicRepo = Container.get(TopicRepository);

  const test: { topic?: StoredTopic } = {};

  before(async () => {
    await topicRepo.delete();

    test.topic = await topicService.create({
      name: 'Test',
    });
  });

  it('should return not found error when id is not found', async () => {
    await expect(
      topicService.findOne({
        id: 999,
      })
    ).to.eventually.be.rejected;
  });

  it('should return 404 error when id is invalid', async () => {
    await supertest(server.httpServer).get(`/api/topics/invalid`).expect(404);
  });

  it('should return 404 error when id is not found', async () => {
    await supertest(server.httpServer).get(`/api/topics/999`).expect(404);
  });

  it('should return single topic by id', async () => {
    const res = await topicService.findOne({
      id: test.topic?.id,
    });

    expect(res).to.eql(test.topic);
  });

  it('should return 200 with single topic', async () => {
    const res = await supertest(server.httpServer)
      .get(`/api/topics/${test.topic?.id}`)
      .expect(200);

    expect(res.body.data.id).to.eql(test.topic?.id);
    expect(res.body.data.name).to.eql(test.topic?.name);
  });
});
