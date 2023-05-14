import autobind from 'autobind-decorator';
import { Inject, Service } from 'typedi';
import { NotFoundError } from '../../common/app/http-error/not-found.error';
import { RouterContext } from '../../common/app/response';
import { EmptyResultError } from '../../common/errors/empty-result-error';
import { StoredTopic } from './topic.entity';
import { TopicService } from './topic.service';
import { RowsData } from '../../common/repository/repository';

@Service()
export class TopicController {
  constructor(public topicService: TopicService) {}

  @autobind
  async createTopic(context: RouterContext): Promise<StoredTopic> {
    return await this.topicService.create({
      name: context.req.body.name || 'Untitled',
    });
  }

  @autobind
  async getTopics(context: RouterContext): Promise<RowsData<StoredTopic>> {
    return await this.topicService.findAll(context.req.query);
  }

  @autobind
  async findTopic(context: RouterContext): Promise<StoredTopic> {
    try {
      return await this.topicService.findOne(
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
  async updateTopic(context: RouterContext): Promise<StoredTopic> {
    try {
      return await this.topicService.update(
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
  async deleteTopic(context: RouterContext): Promise<void> {
    try {
      await this.topicService.delete({
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
