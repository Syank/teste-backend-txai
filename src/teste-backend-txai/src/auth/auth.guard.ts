import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_ROUTE, jwtConstants } from './constants';
import { Request } from 'express';
import { TokenPayload } from './TokenPayload';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    private jwtService: JwtService;
    private reflector: Reflector;

    constructor(jwtService: JwtService, reflector: Reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;

    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicRoute = this.isAccessingPublicRoute(context);

        if (isPublicRoute) {
            return true;
        }

        const httpRequest = context.switchToHttp();

        const request = httpRequest.getRequest();

        const token = this.extractTokenFromHeader(request);

        try {
            const payload = await this.checkAndExtractPayload(token);

            request["userId"] = payload.sub;
            request["userRole"] = payload.role;

        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private isAccessingPublicRoute(context: ExecutionContext): boolean {
        const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
            context.getHandler(),
            context.getClass()
        ]);

        return isPublicRoute;
    }

    private async checkAndExtractPayload(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            }) as TokenPayload;

            return payload;
        } catch {
            throw new UnauthorizedException();
        }

    }

    private extractTokenFromHeader(request: Request): string {
        const requestHeaders = request.headers;

        const authorizationHeader = requestHeaders.authorization;

        if (!authorizationHeader) {
            throw new UnauthorizedException();
        }

        const [type, token] = authorizationHeader.split(' ');

        if (type !== "Bearer") {
            throw new UnauthorizedException();
        }

        return token;
    }

}
