import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from '../../../common/dto/base/base-filter.dto';

export class GetTopicDto extends BaseFilterDto {
  @Expose()
  @IsOptional()
  @IsString()
  name: string;
}
