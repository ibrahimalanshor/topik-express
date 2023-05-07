import { Service } from 'typedi';
import { CreationTopic, StoredTopic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Service()
export class TopicService {
  constructor(public topicRepository: TopicRepository) {}

  async create(values: CreationTopic): Promise<StoredTopic> {
    return await this.topicRepository.create(values);
  }
}
