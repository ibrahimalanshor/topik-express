import { Service } from 'typedi';
import { BaseRepository } from '../../common/repository/repository';
import { Topic } from './topic.entity';
import { TopicModel } from './topic.model';

@Service()
export class TopicRepository extends BaseRepository<Topic> {
  model: TopicModel = new TopicModel();
}
