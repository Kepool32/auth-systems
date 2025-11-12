import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Пользователь зарегистрирован и получен JWT',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка регистрации (email или login уже используется)',
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, user } = await this.authService.register(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { user };
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Пользователь авторизован и получен JWT',
  })
  @ApiResponse({ status: 401, description: 'Неверный логин или пароль' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { user };
  }

  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Пользователь разлогинен, cookie очищена',
  })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
