import { expect } from '../../../src/common/test/chai';
import { before, describe, it } from 'mocha';
import supertest from 'supertest';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { server } from '../../../server';
import Container from 'typedi';
import { generateFilterTest } from '../../../src/common/test/it/filter.it';
import { ChatRepository } from '../../../src/modules/chat/chat.repository';
import { ChatService } from '../../../src/modules/chat/chat.service';
import { GetChatDto } from '../../../src/modules/chat/dto/get-chat.dto';
import { CreateChatDto } from '../../../src/modules/chat/dto/create-chat.dto';
import { StoredTopic } from '../../../src/modules/topic/topic.entity';
import { TopicService } from '../../../src/modules/topic/topic.service';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';

describe('get chat test', () => {
  const chatRepo = Container.get(ChatRepository);
  const chatService = Container.get(ChatService);
  const topicService = Container.get(TopicService);
  const topicRepo = Container.get(TopicRepository);

  describe('validation test', () => {
    const invalidPayload = {
      topic_id: [],
    };

    it('should return validation schema error when object is invalid', async () => {
      const transformPayload = createObjectTransformerWithValidator(GetChatDto);

      await expect(transformPayload(invalidPayload)).to.eventually.be.rejected;
    });

    it('should return 400 when query request is invalid', async () => {
      const res = await supertest(server.httpServer)
        .get('/api/chats')
        .query(invalidPayload)
        .expect(400);

      expect(res.body).to.have.property('errors').and.have.property('topic_id');
    });
  });

  describe('get test', () => {
    const chatContents: CreateChatDto[] = ['Test 1', 'Test 2', 'Test 3'].map(
      (content) => ({ content, topic_id: 9999 })
    );
    const test: { topics: StoredTopic[]; chats: CreateChatDto[] } = {
      topics: [],
      chats: [],
    };

    before(async () => {
      await chatRepo.delete();
      await topicRepo.delete();

      test.topics = await Promise.all(
        ['Topic 1', 'Topic 2', 'Topic 3'].map((name) =>
          topicService.create({ name })
        )
      );
      test.chats = chatContents.map((chat, index) => ({
        content: chat.content,
        topic_id: test.topics[index].id,
      }));

      await chatService.create(
        test.chats.map((chat, index) => ({
          ...chat,
          topic_id: test.topics[index].id,
        }))
      );

      generateFilterTest(chatService.findAll.bind(chatService), {
        data: chatContents,
        id: 'content',
        endpoint: '/api/chats',
        total: 1,
        query: {
          topic_id: test.topics[0].id,
        },
        expected: {
          offset: null,
          sort: test.chats[0],
        },
      });
    });

    it('should get all topics', async () => {
      const res = await chatService.findAll();

      expect(res).to.be.an('array').and.have.length(3);
    });

    it('should get all chat by topic', async () => {
      const topicId = test.topics[1].id;
      const chat = test.chats[1];

      const res = await chatService.findAll({
        topic_id: topicId,
      });

      expect(res).to.be.an('array').and.have.length(1);
      expect(res[0].content).to.equal(chat.content);
    });

    it('should 200 chat by topic', async () => {
      const topicId = test.topics[1].id;
      const chat = test.chats[1];

      const res = await supertest(server.httpServer)
        .get('/api/chats')
        .query({
          topic_id: topicId,
        })
        .expect(200);

      expect(res.body.data).to.be.an('array').and.have.length(1);
      expect(res.body.data[0].content).to.equal(chat.content);
    });
  });
});
