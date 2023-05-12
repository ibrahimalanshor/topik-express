import { Expose } from 'class-transformer';
import { IsInt, IsDefined, IsNotEmpty } from 'class-validator';
import { BaseFilterDto } from '../../../common/dto/base/base-filter.dto';
import { RowId } from '../../../common/model/model';

export class GetChatDto extends BaseFilterDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @IsNotEmpty()
  topic_id: RowId;
}
