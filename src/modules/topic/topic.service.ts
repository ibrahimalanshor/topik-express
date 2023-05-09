import { Service } from 'typedi';
import { FindOneOptions, RowId } from '../../common/model/model';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FindTopicDto } from './dto/find-topic.dto';
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

  async findOne(
    query: FindTopicDto,
    options?: FindOneOptions
  ): Promise<StoredTopic> {
    return await this.topicRepository.findOne(query, {
      throwOnEmpty: options?.throwOnEmpty ?? true,
    });
  }
}
