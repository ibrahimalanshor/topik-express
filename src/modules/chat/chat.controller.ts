import autobind from 'autobind-decorator';
import { Service } from 'typedi';
import { NotFoundError } from '../../common/app/http-error/not-found.error';
import { RouterContext } from '../../common/app/response';
import { EmptyResultError } from '../../common/errors/empty-result-error';
import { ChatService } from './chat.service';
import { StoredChat } from './chat.entity';
import { TopicService } from '../topic/topic.service';
import { BadRequestError } from '../../common/app/http-error/bad-request.error';
import { RowsData } from '../../common/repository/repository';

@Service()
export class ChatController {
  constructor(
    public chatService: ChatService,
    public topicService: TopicService
  ) {}

  @autobind
  async createChat(context: RouterContext): Promise<StoredChat> {
    try {
      await this.topicService.findOne(
        { id: context.req.body.topic_id },
        {
          throwOnEmpty: true,
        }
      );
    } catch (err) {
      if (err instanceof EmptyResultError) {
        throw new BadRequestError();
      }
    }

    return await this.chatService.create(context.req.body);
  }

  @autobind
  async getChats(context: RouterContext): Promise<RowsData<StoredChat>> {
    return await this.chatService.findAll(context.req.query);
  }

  @autobind
  async findChat(context: RouterContext): Promise<StoredChat> {
    try {
      return await this.chatService.findOne(
        { id: +context.req.params.id },
        { throwOnEmpty: true }
      );
    } catch (err) {
      if (err instanceof EmptyResultError) {
        throw new NotFoundError();
      }

      throw err;
    }
  }

  @autobind
  async updateChat(context: RouterContext): Promise<StoredChat> {
    try {
      return await this.chatService.update(
        { id: +context.req.params.id },
        context.req.body
      );
    } catch (err) {
      if (err instanceof EmptyResultError) {
        throw new NotFoundError();
      }

      throw err;
    }
  }

  @autobind
  async deleteChat(context: RouterContext): Promise<void> {
    try {
      await this.chatService.delete({
        id: +context.req.params.id,
      });
    } catch (err) {
      if (err instanceof EmptyResultError) {
        throw new NotFoundError();
      }

      throw err;
    }
  }
}
