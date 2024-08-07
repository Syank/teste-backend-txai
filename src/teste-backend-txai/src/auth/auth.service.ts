import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { Authentication } from './DTOs/Authentication';

@Injectable()
export class AuthService {
    private userService: UsersService;
    private jwtService: JwtService;

    constructor(userService: UsersService, jwtService: JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;

    }

    public async authenticate(authenticationInfo: Authentication) {
        const userFound = await this.userService.findByLogin(authenticationInfo.login);

        if (userFound.password !== authenticationInfo.password) {
            throw new Error('Invalid password');
        }

        const jwtToken = this.createJwtTokenForUser(userFound);

        return jwtToken;
    }

    private async createJwtTokenForUser(user: User) {
        const jwtPayload = {
            sub: user.id,
            role: user.role
        };

        const jwtToken = await this.jwtService.signAsync(jwtPayload);

        return jwtToken;
    }

}
