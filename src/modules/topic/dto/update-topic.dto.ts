import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { BaseParamId } from '../../../common/dto/base/base-param-id.dto';

export class UpdateTopicParamsDto extends BaseParamId {}

export class UpdateTopicValuesDto {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;
}
