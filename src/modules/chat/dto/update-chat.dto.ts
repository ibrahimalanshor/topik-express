import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { BaseParamId } from '../../../common/dto/base/base-param-id.dto';

export class UpdateChatParamsDto extends BaseParamId {}

export class UpdateChatValuesDto {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;
}
