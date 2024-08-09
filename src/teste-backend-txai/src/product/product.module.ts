import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [ProductService, PrismaClient],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {

}
