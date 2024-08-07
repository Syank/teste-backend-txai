import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaClient],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {

}
