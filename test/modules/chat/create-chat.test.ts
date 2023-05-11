import { before, describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import supertest from 'supertest';
import { server } from '../../../server';
import { ChatService } from '../../../src/modules/chat/chat.service';
import Container from 'typedi';
import { ChatRepository } from '../../../src/modules/chat/chat.repository';
import { CreateChatDto } from '../../../src/modules/chat/dto/create-chat.dto';
import { TopicService } from '../../../src/modules/topic/topic.service';
import { RowId } from '../../../src/common/model/model';
import { TopicRepository } from '../../../src/modules/topic/topic.repository';

describe('create chat test', () => {
  const chatService = Container.get(ChatService);
  const topicService = Container.get(TopicService);
  const chatRepo = Container.get(ChatRepository);
  const topicRepo = Container.get(TopicRepository);

  describe('validation test', () => {
    const invalidPayload = {
      content: '',
      topic_id: '',
    };

    it('should return validation schema error when object is invalid', async () => {
      const transformPayload =
        createObjectTransformerWithValidator(CreateChatDto);

      await expect(transformPayload(invalidPayload)).to.eventually.be.rejected;
    });

    it('it should return 422 when body request is invalid', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/chats')
        .send(invalidPayload)
        .expect(422);

      expect(res.body.errors).and.have.property('content');
      expect(res.body.errors).and.have.property('topic_id');
    });
  });

  describe('topic id not found test', () => {
    it('should return 400 when topic id is not found', async () => {
      await supertest(server.httpServer)
        .post('/api/chats')
        .send({
          content: 'Hello World',
          topic_id: 999,
        })
        .expect(400);
    });
  });

  describe('creation test', () => {
    const payload: { content: string; topic_id: RowId } = {
      content: 'Hello World',
      topic_id: 999,
    };

    before(async () => {
      await chatRepo.delete();
      await topicRepo.delete();

      payload.topic_id = (await topicService.create({ name: 'test' })).id;
    });

    it('should insert new topic', async () => {
      const topic = await chatService.create(payload);

      expect(topic).to.have.property('content').and.eql(payload.content);
      expect(topic).to.have.property('topic_id').and.eql(payload.topic_id);
    });

    it('should return 200 with stored topic', async () => {
      const res = await supertest(server.httpServer)
        .post('/api/chats')
        .send(payload)
        .expect(200);

      expect(res.body)
        .to.have.property('data')
        .and.have.property('content')
        .and.eql(payload.content);

      expect(res.body)
        .to.have.property('data')
        .and.have.property('topic_id')
        .and.eql(payload.topic_id);
    });
  });
});
