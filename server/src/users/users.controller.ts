import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Информация о текущем пользователе',
  })
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiResponse({ status: 200, description: 'Обновленные данные пользователя' })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }
}
