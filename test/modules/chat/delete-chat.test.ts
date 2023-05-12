import { describe, it, before, beforeEach } from 'mocha';
import supertest from 'supertest';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { server } from '../../../server';
import Container from 'typedi';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';
import { ChatService } from '../../../src/modules/chat/chat.service';
import { ChatRepository } from '../../../src/modules/chat/chat.repository';
import { DeleteChatParamsDto } from '../../../src/modules/chat/dto/delete-chat.dto';
import { StoredChat } from '../../../src/modules/chat/chat.entity';

describe('delete chat test', () => {
  const chatService = Container.get(ChatService);
  const chatRepo = Container.get(ChatRepository);
  const topicRepo = Container.get(TopicRepository);

  describe('invalid param test', () => {
    const invalidParams = {
      id: 'invalid',
    };
    it('should throw validation schema error when param is invalid', async () => {
      const transformParam =
        createObjectTransformerWithValidator(DeleteChatParamsDto);

      await expect(transformParam(invalidParams)).to.eventually.be.rejected;
    });
    it('should return 404 param is invalid', async () => {
      await supertest(server.httpServer)
        .delete(`/api/chats/${invalidParams.id}`)
        .expect(404);
    });
  });
  describe('not found param test', () => {
    const params = {
      id: 999,
    };
    it('should throw empty result error when param is not found', async () => {
      await expect(chatService.delete(params)).to.eventually.be.rejected;
    });
    it('should return 404 when param is not found', async () => {
      await supertest(server.httpServer)
        .delete(`/api/chats/${params.id}`)
        .expect(404);
    });
  });
  describe('delete test', () => {
    const params: { chat?: StoredChat } = {};

    before(async () => {
      await chatRepo.delete();
      await topicRepo.delete();
    });

    beforeEach(async () => {
      const topic = await topicRepo.create({ name: 'test' });

      params.chat = await chatService.create({
        content: 'test',
        topic_id: topic.id,
      });
    });

    it('should delete chat by id', async () => {
      await expect(
        chatService.delete({
          id: params.chat?.id,
        })
      ).to.eventually.be.fulfilled;
    });
    it('should return 200', async () => {
      await supertest(server.httpServer)
        .delete(`/api/chats/${params.chat?.id}`)
        .expect(200);
    });
  });
});
