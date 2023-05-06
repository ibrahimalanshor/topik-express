import { createBodyValidator } from '../../common/app/middlewares/request.middleware';
import { createJsonResponse } from '../../common/app/response';
import { createRoute } from '../../common/app/router';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicController } from './topic.controller';

export const topicRoute = createRoute<TopicController>(TopicController)
  .post('/api/topics', (controller: TopicController) => [
    createBodyValidator(CreateTopicDto),
    createJsonResponse(controller.createTopic),
  ])
  .getRouter();
