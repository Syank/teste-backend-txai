import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { TokenPayload } from './TokenPayload';

@Injectable()
export class AuthGuard implements CanActivate {
    private jwtService: JwtService;

    constructor(jwtService: JwtService) {
        this.jwtService = jwtService;

    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpRequest = context.switchToHttp();

        const request = httpRequest.getRequest();

        const token = this.extractTokenFromHeader(request);

        try {
            const payload = await this.checkAndExtractPayload(token);

            request['userId'] = payload.sub;
            request["userRole"] = payload.role;

        } catch {
            throw new UnauthorizedException();
        }

        return true;
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
