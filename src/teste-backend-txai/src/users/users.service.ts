import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';

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
        });

        return userFound;
    }

    public async registerUser(userToRegister: User) {
        const insertQuery: Prisma.UserCreateArgs = {
            data: userToRegister
        };

        const createdUser = await this.prisma.user.create(insertQuery);

        return createdUser;
    }

    public async updateUser(userToUpdate: User) {
        const updateQuery: Prisma.UserUpdateArgs = {
            where: {
                id: userToUpdate.id
            },
            data: userToUpdate
        };

        const updatedUser = await this.prisma.user.update(updateQuery);

        return updatedUser;
    }

    public async deleteUser(userId: number) {
        const deleteQuery: Prisma.UserDeleteArgs = {
            where: {
                id: userId
            }
        };

        const deletedUser = await this.prisma.user.delete(deleteQuery);

        return deletedUser;
    }

    public async findAll() {
        const allUsers = await this.prisma.user.findMany();

        return allUsers;
    }

}
