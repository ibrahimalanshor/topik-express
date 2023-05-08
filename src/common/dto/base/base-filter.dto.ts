import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BaseFilterDto {
  @Expose()
  @IsOptional()
  limit: number;

  @Expose()
  @IsOptional()
  offset: number;

  @Expose()
  @IsOptional()
  @IsString()
  sort: string;
}
