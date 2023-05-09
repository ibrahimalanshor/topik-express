import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { RowId } from '../../model/model';

export class BaseParamId {
  @Expose()
  @IsOptional()
  @IsInt()
  id?: RowId;
}
