import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication } from './DTOs/Authentication';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    public authenticate(@Body() body: Authentication) {
        const response = this.authService.authenticate(body);

        return response;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('userId')
    public getUserId(@Request() request) {
        return request['userRole'];
    }
}
