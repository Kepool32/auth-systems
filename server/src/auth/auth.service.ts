import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail)
      throw new BadRequestException('Email already registered');

    const existingLogin = await this.usersService.findByLogin(dto.login);
    if (existingLogin)
      throw new BadRequestException('Login already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      ...dto,
      passwordHash,
    });

    const accessToken = this.generateAccessToken(user);

    return { accessToken, user };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.generateAccessToken(user);

    return { accessToken, user };
  }

  private generateAccessToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
  }
}
