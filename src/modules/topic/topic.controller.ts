import { RouterContext } from '../../common/app/response';

export class TopicController {
  createTopic(context: RouterContext) {
    return context.req.body;
  }
}
