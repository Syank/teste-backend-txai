import { Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { Request } from 'express';

@Controller('product')
export class ProductController {

    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;

    }

    @Get("findAll")
    public async findAll(@Req() request: Request) {
        const userId = request["userId"];

        const response = await this.productService.findAll(userId);

        return response;
    }

    @Post("createProduct")
    public async createProduct(@Body() productToCreate: Product, @Req() request: Request) {
        const userId = request["userId"];

        const response = await this.productService.createProduct(userId, productToCreate);

        return response;
    }

    @Put("updateProduct")
    public async updateProduct(@Body() productToUpdate: Product, @Req() request: Request) {
        const userId = request["userId"];

        const response = await this.productService.updateProduct(userId, productToUpdate);

        return response;
    }

    @Delete("deleteProduct")
    public async deleteProduct(@Query("productId") productId: string, @Req() request: Request) {
        const userId = request["userId"];

        const response = await this.productService.deleteProduct(userId, parseInt(productId));

        return response;
    }

}
