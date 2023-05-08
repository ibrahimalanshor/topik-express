import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BaseFilterDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  limit: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsOptional()
  @IsString()
  sort: string;
}
