import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [UsersService, PrismaClient, AuthService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {

}
