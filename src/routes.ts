import { authRoute } from './modules/auth/auth.route';
import { chatRoute } from './modules/chat/chat.route';
import { topicRoute } from './modules/topic/topic.route';

export const routes = [topicRoute, chatRoute, authRoute];
