import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module(AppModule.APPLICATION_MODULE_CONFIGURATIONS)
export class AppModule {
    public static readonly APPLICATION_PROVIDERS = [
        PrismaClient,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ];

    public static readonly APPLICATION_MODULE_CONFIGURATIONS = {
        imports: [AuthModule, UsersModule, ProductModule],
        controllers: [],
        providers: AppModule.APPLICATION_PROVIDERS
    };

}
