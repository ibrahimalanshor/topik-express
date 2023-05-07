import { Model } from '../../common/model/model';
import { Topic } from './topic.entity';

export class TopicModel extends Model<Topic> {
  tableName: string = 'topics';
  columns: string[] = ['name'];
  filterables: string[] = ['id'];
}
