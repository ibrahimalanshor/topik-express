import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @Expose()
  @IsOptional()
  @IsString()
  name: string;
}
