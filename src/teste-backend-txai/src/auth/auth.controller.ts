import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication } from './DTOs/Authentication';
import { PublicRoute } from './constants';

@Controller('auth')
export class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

    }

    @PublicRoute()
    @Post('login')
    @HttpCode(200)
    public authenticate(@Body() body: Authentication) {
        const response = this.authService.authenticate(body);

        return response;
    }

    @Get('userId')
    public getUserId(@Request() request) {
        return request['userId'];
    }

}
