import { IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsOptional()
  @IsString()
  name: string;
}
