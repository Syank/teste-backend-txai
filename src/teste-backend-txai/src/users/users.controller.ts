import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AdministrativeRouteGuard } from 'src/auth/administrativeAuth.guard';

@UseGuards(AdministrativeRouteGuard)
@Controller("users")
export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;

    }

    @Get("findAll")
    public async findAll() {
        const response = await this.usersService.findAll();

        return response;
    }

    @Post("registerUser")
    public async registerUser(@Body() userToCreate: User) {
        const response = await this.usersService.registerUser(userToCreate);

        return response;
    }

    @Put("updateUser")
    public async updateUser(@Body() userToUpdate: User) {
        const response = await this.usersService.updateUser(userToUpdate);

        return response;
    }

    @Delete("deleteUser")
    public async deleteUser(@Body("userId") userId: number) {
        const response = await this.usersService.deleteUser(userId);

        return response;
    }

}
