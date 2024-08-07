import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;

    }

    public async findByLogin(login: string) {
        const userFound = await this.prisma.user.findUnique({
            where: {
                login: login
            }
        })

        if (!userFound) {
            throw new Error('User not found');
        }

        return userFound;
    }

}
