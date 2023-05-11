import { Expose } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { RowId } from '../../../common/model/model';

export class CreateChatDto {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsDefined()
  @IsInt()
  @IsNotEmpty()
  topic_id: RowId;
}
