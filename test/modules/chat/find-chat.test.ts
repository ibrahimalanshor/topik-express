import { expect } from '../../../src/common/test/chai';
import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import Container from 'typedi';
import { server } from '../../../server';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { ChatService } from '../../../src/modules/chat/chat.service';
import { ChatRepository } from '../../../src/modules/chat/chat.repository';
import { StoredChat } from '../../../src/modules/chat/chat.entity';
import { AuthResult } from '../../../src/modules/auth/auth.entity';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { generateAuthTest } from '../../../src/common/test/it/auth.it';

describe('find chat test', () => {
  const chatService = Container.get(ChatService);
  const chatRepo = Container.get(ChatRepository);
  const topicRepo = Container.get(TopicRepository);
  const authService = Container.get(AuthService);

  const requestOptions: { token: AuthResult } = {
    token: '',
  };
  const test: { chat?: StoredChat } = {};

  generateAuthTest('get', '/api/chats/id');

  before(async () => {
    await topicRepo.delete();
    await chatRepo.delete();

    const topic = await topicRepo.create({ name: 'test' });

    requestOptions.token = await authService.login({ password: 'password' });
    test.chat = await chatService.create({
      content: 'Test',
      topic_id: topic.id,
    });
  });

  it('should return not found error when id is not found', async () => {
    await expect(
      chatService.findOne({
        id: 999,
      })
    ).to.eventually.be.rejected;
  });

  it('should return 404 error when id is invalid', async () => {
    await supertest(server.httpServer)
      .get(`/api/chats/invalid`)
      .set({
        authorization: requestOptions.token,
      })
      .expect(404);
  });

  it('should return 404 error when id is not found', async () => {
    await supertest(server.httpServer)
      .get(`/api/chats/999`)
      .set({
        authorization: requestOptions.token,
      })
      .expect(404);
  });

  it('should return single chat by id', async () => {
    const res = await chatService.findOne({
      id: test.chat?.id,
    });

    expect(res).to.eql(test.chat);
  });

  it('should return 200 with single chat', async () => {
    const res = await supertest(server.httpServer)
      .get(`/api/chats/${test.chat?.id}`)
      .set({
        authorization: requestOptions.token,
      })
      .expect(200);

    expect(res.body.data.id).to.eql(test.chat?.id);
    expect(res.body.data.content).to.eql(test.chat?.content);
    expect(res.body.data.topic_id).to.eql(test.chat?.topic_id);
  });
});
