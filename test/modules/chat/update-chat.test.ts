import { before, describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import supertest from 'supertest';
import { server } from '../../../server';
import Container from 'typedi';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { ChatService } from '../../../src/modules/chat/chat.service';
import { ChatRepository } from '../../../src/modules/chat/chat.repository';
import { UpdateChatValuesDto } from '../../../src/modules/chat/dto/update-chat.dto';
import { StoredChat } from '../../../src/modules/chat/chat.entity';

describe('update chat test', () => {
  const chatService = Container.get(ChatService);
  const chatRepo = Container.get(ChatRepository);
  const topicRepo = Container.get(TopicRepository);

  describe('validation test', () => {
    it('should return validation error when object is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(UpdateChatValuesDto);

      await expect(
        transformPayload({
          content: [],
        })
      ).to.eventually.be.rejected;
    });
    it('should return 422 when body is invalid', async () => {
      const res = await supertest(server.httpServer)
        .patch(`/api/chats/1`)
        .send({
          content: '    ',
        })
        .expect(422);

      expect(res.body).to.have.property('errors').and.have.property('content');
    });
  });

  describe('invalid id test', () => {
    it('should return empty result error when id is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(UpdateChatValuesDto);

      await expect(
        transformPayload({
          id: 'invalid',
        })
      ).to.eventually.be.rejected;
    });

    it('should 404 when params id is invalid', async () => {
      await supertest(server.httpServer)
        .patch(`/api/chats/invalid`)
        .send({
          content: 'content',
        })
        .expect(404);
    });
  });

  describe('not found test', () => {
    it('should return empty result error when id is not exists', async () => {
      await expect(chatService.update({ id: 999 }, { content: 'test' })).to
        .eventually.be.rejected;
    });
    it('should return 404 when id is not exists', async () => {
      await supertest(server.httpServer)
        .patch('/api/chats/999')
        .send({ content: 'test' })
        .expect(404);
    });
  });

  describe('update test', () => {
    const test: { chat?: StoredChat } = {};
    const payload = {
      content: 'Update',
    };

    before(async () => {
      await topicRepo.delete();
      await chatRepo.delete();

      const topic = await topicRepo.create({ name: 'test' });

      test.chat = await chatService.create({
        content: 'Test',
        topic_id: topic.id,
      });
    });

    it('should success updated test', async () => {
      const res = await chatService.update({ id: test.chat?.id }, payload);

      expect(res.content).to.eql(payload?.content);
    });

    it('should 200 updated test', async () => {
      const res = await supertest(server.httpServer)
        .patch(`/api/chats/${test.chat?.id}`)
        .send(payload)
        .expect(200);

      expect(res.body.data.content).to.eql(payload?.content);
    });
  });
});
