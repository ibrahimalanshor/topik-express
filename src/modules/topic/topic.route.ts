import Container from 'typedi';
import { createBodyValidator } from '../../common/app/middlewares/request.middleware';
import { createTrimBodyMiddleware } from '../../common/app/middlewares/trim-body.middleware';
import { createJsonResponse } from '../../common/app/response';
import { createRoute } from '../../common/app/router';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicController } from './topic.controller';

export const topicRoute = createRoute<TopicController>(
  Container.get(TopicController)
)
  .post('/api/topics', (controller: TopicController) => [
    createTrimBodyMiddleware(),
    createBodyValidator(CreateTopicDto),
    createJsonResponse(controller.createTopic),
  ])
  .getRouter();
