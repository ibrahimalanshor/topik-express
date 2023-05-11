import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseFilterDto } from '../../../common/dto/base/base-filter.dto';
import { RowId } from '../../../common/model/model';

export class GetChatDto extends BaseFilterDto {
  @Expose()
  @IsOptional()
  @IsInt()
  topic_id: RowId;
}
