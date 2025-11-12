import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'TestUser',
    description: 'Уникальный логин пользователя',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

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
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/, {
    message:
      'Password must contain at least 8 characters, 1 uppercase, 1 lowercase and 1 number',
  })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
