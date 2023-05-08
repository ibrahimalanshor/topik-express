import { Service } from 'typedi';
import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { StoredTopic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Service()
export class TopicService {
  constructor(public topicRepository: TopicRepository) {}

  async create(
    values: CreateTopicDto | CreateTopicDto[]
  ): Promise<StoredTopic> {
    return await this.topicRepository.create(values);
  }

  async findAll(query?: Partial<GetTopicDto>): Promise<StoredTopic[]> {
    return await this.topicRepository.findALl(query);
  }
}
