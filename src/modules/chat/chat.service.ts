import { Service } from 'typedi';
import {
  DeleteOptions,
  FindOneOptions,
  UpdateOptions,
} from '../../common/model/model';
import { ChatRepository } from './chat.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { StoredChat } from './chat.entity';
import { GetChatDto } from './dto/get-chat.dto';
import { FindChatParamsDto } from './dto/find-chat.dto';
import {
  UpdateChatParamsDto,
  UpdateChatValuesDto,
} from './dto/update-chat.dto';
import { DeleteChatParamsDto } from './dto/delete-chat.dto';

@Service()
export class ChatService {
  constructor(public chatRepo: ChatRepository) {}

  async create(values: CreateChatDto | CreateChatDto[]): Promise<StoredChat> {
    return await this.chatRepo.create(values);
  }

  async findAll(query?: Partial<GetChatDto>): Promise<StoredChat[]> {
    return await this.chatRepo.findALl(query);
  }

  async findOne(
    query: FindChatParamsDto,
    options?: FindOneOptions
  ): Promise<StoredChat> {
    return await this.chatRepo.findOne(query, {
      throwOnEmpty: options?.throwOnEmpty ?? true,
    });
  }

  async update(
    query: UpdateChatParamsDto,
    values: UpdateChatValuesDto,
    options?: UpdateOptions
  ): Promise<StoredChat> {
    return await this.chatRepo.update(query, values, {
      throwOnNoAffectedRows: options?.throwOnNoAffectedRows ?? true,
      returnUpdated: true,
    });
  }

  async delete(
    query: DeleteChatParamsDto,
    options?: DeleteOptions
  ): Promise<void> {
    await this.chatRepo.delete(query, {
      throwOnNoAffectedRows: options?.throwOnNoAffectedRows ?? true,
    });
  }
}
