import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

interface CreateUserInput {
  login: string;
  email: string;
  passwordHash: string;
  username: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: CreateUserInput): Promise<User> {
    const existingEmail = await this.findByEmail(data.email);
    if (existingEmail)
      throw new BadRequestException('Email already registered');

    const existingLogin = await this.findByLogin(data.login);
    if (existingLogin)
      throw new BadRequestException('Login already registered');

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(
    id: string,
    data: Partial<User> & { password?: string },
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new BadRequestException('User not found');

    if (data.password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(data.password, saltRounds);
    }

    if (data.username) user.username = data.username;
    if (data.email) user.email = data.email;
    if (data.login) user.login = data.login;

    return this.userRepository.save(user);
  }
}
