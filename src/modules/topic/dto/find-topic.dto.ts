import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { RowId } from '../../../common/model/model';

export class FindTopicDto {
  @Expose()
  @IsOptional()
  @IsInt()
  id?: RowId;
}
