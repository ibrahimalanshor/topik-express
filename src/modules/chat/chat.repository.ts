import { Service } from 'typedi';
import { BaseRepository } from '../../common/repository/repository';
import { Chat } from './chat.entity';
import { ChatModel } from './chat.model';

@Service()
export class ChatRepository extends BaseRepository<Chat> {
  model: ChatModel = new ChatModel();
}
