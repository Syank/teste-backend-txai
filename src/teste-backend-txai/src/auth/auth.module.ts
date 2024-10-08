import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from '../users/users.module';

@Module(AuthModule.AUTH_MODULE_CONFIGURATIONS)
export class AuthModule {
    private static readonly AUTH_MODULE_IMPORTS = [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: "1h"
            }
        })
    ];

    private static readonly AUTH_MODULE_CONFIGURATIONS = {
        imports: AuthModule.AUTH_MODULE_IMPORTS,
        controllers: [AuthController],
        providers: [AuthService],
        exports: [AuthService]
    };

}
