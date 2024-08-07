import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AdministrativeRouteGuard implements CanActivate {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService

    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpRequest = context.switchToHttp();

        const request = httpRequest.getRequest();

        const token = this.authService.extractTokenFromHeader(request);

        try {
            const payload = await this.authService.checkAndExtractPayload(token);

            const userRole = request["userRole"] = payload.role;

            if (userRole !== "ADMIN") {
                throw new UnauthorizedException();
            }

        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

}