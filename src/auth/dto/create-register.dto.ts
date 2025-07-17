/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEmail, Length } from 'class-validator';
export class CreateRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
