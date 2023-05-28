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
import { FindTopicParamsDto } from './dto/find-topic.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { TopicController } from './topic.controller';
import { toNumber } from '../../common/helpers/convert-type.helper';
import {
  UpdateTopicParamsDto,
  UpdateTopicValuesDto,
} from './dto/update-topic.dto';
import { DeleteTopicParamsDto } from './dto/delete-topic.dto';
import { createAuthMiddleware } from '../../common/app/middlewares/auth.middleware';

export const topicRoute = createRoute<TopicController>(
  Container.get(TopicController)
)
  .post('/api/topics', (controller: TopicController) => [
    createAuthMiddleware(),
    createTrimBodyMiddleware(),
    createBodyValidator(CreateTopicDto),
    createJsonResponse(controller.createTopic),
  ])
  .get('/api/topics', (controller: TopicController) => [
    createAuthMiddleware(),
    createQueryValidator(GetTopicDto),
    createRemoveUndefinedValuesMiddleware(),
    createJsonResponse(controller.getTopics),
  ])
  .get('/api/topics/:id', (controller: TopicController) => [
    createAuthMiddleware(),
    createParamsValidator(FindTopicParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createJsonResponse(controller.findTopic),
  ])
  .patch('/api/topics/:id', (controller: TopicController) => [
    createAuthMiddleware(),
    createParamsValidator(UpdateTopicParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createTrimBodyMiddleware(),
    createBodyValidator(UpdateTopicValuesDto),
    createJsonResponse(controller.updateTopic),
  ])
  .delete('/api/topics/:id', (controller: TopicController) => [
    createAuthMiddleware(),
    createParamsValidator(DeleteTopicParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createJsonResponse(controller.deleteTopic),
  ])
  .getRouter();
