import autobind from 'autobind-decorator';
import { Inject, Service } from 'typedi';
import { RouterContext } from '../../common/app/response';
import { TopicService } from './topic.service';

@Service()
export class TopicController {
  constructor(public topicService: TopicService) {}

  @autobind
  async createTopic(context: RouterContext) {
    return await this.topicService.create({
      name: context.req.body.name || 'Untitled',
    });
  }

  @autobind
  async getTopics(context: RouterContext) {
    return context.req.query;
  }
}
