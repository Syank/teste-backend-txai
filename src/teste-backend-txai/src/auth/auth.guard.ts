import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicRoute = this.authService.isAccessingPublicRoute(context);

        if (isPublicRoute) {
            return true;
        }

        const httpRequest = context.switchToHttp();

        const request = httpRequest.getRequest();

        const token = this.authService.extractTokenFromHeader(request);

        try {
            const payload = await this.authService.checkAndExtractPayload(token);

            request["userId"] = payload.sub;
            request["userRole"] = payload.role;

        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

}
