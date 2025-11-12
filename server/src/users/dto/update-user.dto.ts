import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'newemail@example.com',
    description: 'Новый email пользователя',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'New Name',
    description: 'Новое имя пользователя',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({
    example: 'NewPassword123',
    description: 'Новый пароль пользователя',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
