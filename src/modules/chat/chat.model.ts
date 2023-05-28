import { Model, FilterableColumn } from '../../common/model/model';
import { Chat } from './chat.entity';

export class ChatModel extends Model<Chat> {
  tableName: string = 'chats';
  columns: string[] = ['content', 'topic_id'];
  filterables: (string | FilterableColumn)[] = ['id', 'topic_id'];
}
