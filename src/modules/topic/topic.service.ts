import { Service } from 'typedi';
import {
  DeleteOptions,
  FindOneOptions,
  UpdateOptions,
} from '../../common/model/model';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FindTopicParamsDto } from './dto/find-topic.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import {
  UpdateTopicParamsDto,
  UpdateTopicValuesDto,
} from './dto/update-topic.dto';
import { StoredTopic } from './topic.entity';
import { TopicRepository } from './topic.repository';
import { DeleteTopicParamsDto } from './dto/delete-topic.dto';

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
    query: FindTopicParamsDto,
    options?: FindOneOptions
  ): Promise<StoredTopic> {
    return await this.topicRepository.findOne(query, {
      throwOnEmpty: options?.throwOnEmpty ?? true,
    });
  }

  async update(
    query: UpdateTopicParamsDto,
    values: UpdateTopicValuesDto,
    options?: UpdateOptions
  ): Promise<StoredTopic> {
    return await this.topicRepository.update(query, values, {
      throwOnNoAffectedRows: options?.throwOnNoAffectedRows ?? true,
      returnUpdated: true,
    });
  }

  async delete(
    query: DeleteTopicParamsDto,
    options?: DeleteOptions
  ): Promise<void> {
    await this.topicRepository.delete(query, {
      throwOnNoAffectedRows: options?.throwOnNoAffectedRows ?? true,
    });
  }
}
