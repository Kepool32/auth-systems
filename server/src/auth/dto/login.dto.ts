import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Email пользователя',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
