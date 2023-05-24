import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
