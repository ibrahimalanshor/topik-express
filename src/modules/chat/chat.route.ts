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
import { toNumber } from '../../common/helpers/convert-type.helper';
import { ChatController } from './chat.controller';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { FindChatParamsDto } from './dto/find-chat.dto';
import {
  UpdateChatParamsDto,
  UpdateChatValuesDto,
} from './dto/update-chat.dto';
import { DeleteChatParamsDto } from './dto/delete-chat.dto';
import { createAuthMiddleware } from '../../common/app/middlewares/auth.middleware';

export const chatRoute = createRoute<ChatController>(
  Container.get(ChatController)
)
  .post('/api/chats', (controller: ChatController) => [
    createAuthMiddleware(),
    createTrimBodyMiddleware(),
    createBodyValidator(CreateChatDto),
    createJsonResponse(controller.createChat),
  ])
  .get('/api/chats', (controller: ChatController) => [
    createAuthMiddleware(),
    createQueryValidator(GetChatDto, {
      pre: (query) => ({
        topic_id: toNumber(query.topic_id),
      }),
    }),
    createRemoveUndefinedValuesMiddleware(),
    createJsonResponse(controller.getChats),
  ])
  .get('/api/chats/:id', (controller: ChatController) => [
    createAuthMiddleware(),
    createParamsValidator(FindChatParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createJsonResponse(controller.findChat),
  ])
  .patch('/api/chats/:id', (controller: ChatController) => [
    createAuthMiddleware(),
    createParamsValidator(UpdateChatParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createTrimBodyMiddleware(),
    createBodyValidator(UpdateChatValuesDto),
    createJsonResponse(controller.updateChat),
  ])
  .delete('/api/chats/:id', (controller: ChatController) => [
    createAuthMiddleware(),
    createParamsValidator(DeleteChatParamsDto, {
      pre: (param) => ({
        id: toNumber(param.id),
      }),
    }),
    createJsonResponse(controller.deleteChat),
  ])
  .getRouter();
