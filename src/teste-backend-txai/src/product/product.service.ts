import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Product } from '@prisma/client';

@Injectable()
export class ProductService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;

    }

    public async findAll(userId: number) {
        const findQuery: Prisma.ProductFindManyArgs = {
            where: {
                userId: userId
            }
        };

        const userProducts = await this.prisma.product.findMany(findQuery);

        return userProducts;
    }

    public async createProduct(userId: number, productToCreate: Product) {
        productToCreate.userId = userId;

        const insertQuery: Prisma.ProductCreateArgs = {
            data: productToCreate
        };

        const createdProduct = await this.prisma.product.create(insertQuery);

        return createdProduct;
    }

    public async updateProduct(userId: number, productToUpdate: Product) {
        const updateQuery: Prisma.ProductUpdateArgs = {
            where: {
                id: productToUpdate.id,
                userId: userId
            },
            data: productToUpdate
        };

        const updatedProduct = await this.prisma.product.update(updateQuery);

        return updatedProduct;
    }

    public async deleteProduct(userId: number, productId: number) {
        const deleteQuery: Prisma.ProductDeleteArgs = {
            where: {
                id: productId,
                userId: userId
            }
        };

        const deletedProduct = await this.prisma.product.delete(deleteQuery);

        return deletedProduct;
    }

}
