import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {User} from "./src/users/user.entity";
import {UsersModule} from "./src/users/users.module";
import {AuthModule} from "./src/auth/auth.module";


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get('DB_USER'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                entities: [User],
                synchronize: true,
            }),
        }),
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
