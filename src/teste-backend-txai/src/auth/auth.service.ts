import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Authentication } from './DTOs/Authentication';
import { TokenPayload } from './TokenPayload';
import { IS_PUBLIC_ROUTE, jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private userService: UsersService;
    private jwtService: JwtService;
    private reflector: Reflector;

    constructor(userService: UsersService, jwtService: JwtService, reflector: Reflector) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.reflector = reflector;

    }

    public async authenticate(authenticationInfo: Authentication) {
        const userFound = await this.userService.findByLogin(authenticationInfo.login);

        if (userFound == null || userFound.password !== authenticationInfo.password) {
            throw new UnauthorizedException("Unable to identify the user with the provided credentials");
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

    public isAccessingPublicRoute(context: ExecutionContext): boolean {
        const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
            context.getHandler(),
            context.getClass()
        ]);

        return isPublicRoute;
    }

    public async checkAndExtractPayload(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            }) as TokenPayload;

            return payload;
        } catch {
            throw new UnauthorizedException("Unable to authenticate the user with the provided token");
        }

    }

    public extractTokenFromHeader(request: Request): string {
        const requestHeaders = request.headers;

        const authorizationHeader = requestHeaders.authorization;

        if (!authorizationHeader) {
            throw new UnauthorizedException("The request does not contain the Authorization header");
        }

        const [type, token] = authorizationHeader.split(' ');

        if (type !== "Bearer") {
            throw new UnauthorizedException();
        }

        return token;
    }

}
