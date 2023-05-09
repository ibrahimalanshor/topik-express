import Container from 'typedi';
import { createRemoveUndefinedValuesMiddleware } from '../../common/app/middlewares/remove-undefined-values.middleware';
import {
  createBodyValidator,
  createParamsValidator,
  createQueryValidator,
} from '../../common/app/middlewares/request.middleware';
import { createTrimBodyMiddleware } from '../../common/app/middlewares/trim-body.middleware';
import { createJsonResponse } from '../../common/app/response';
import { createRoute } from '../../common/app/router';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FindTopicDto } from './dto/find-topic.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { TopicController } from './topic.controller';
import { toNumber } from '../../common/helpers/convert-type.helper';

export const topicRoute = createRoute<TopicController>(
  Container.get(TopicController)
)
  .post('/api/topics', (controller: TopicController) => [
    createTrimBodyMiddleware(),
    createBodyValidator(CreateTopicDto),
    createJsonResponse(controller.createTopic),
  ])
  .get('/api/topics', (controller: TopicController) => [
    createQueryValidator(GetTopicDto),
    createRemoveUndefinedValuesMiddleware(),
    createJsonResponse(controller.getTopics),
  ])
  .get('/api/topics/:id', (controller: TopicController) => [
    createParamsValidator(FindTopicDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createJsonResponse(controller.findTopic),
  ])
  .getRouter();
