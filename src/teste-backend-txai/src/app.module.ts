import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [AuthModule, UsersModule],
    controllers: [],
    providers: [PrismaClient],
})
export class AppModule {

}
