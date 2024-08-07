import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AdministrativeRouteGuard implements CanActivate {
    private jwtService: JwtService;

    constructor(jwtService: JwtService) {
        this.jwtService = jwtService;

    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpRequest = context.switchToHttp();

        return true;
    }
    
}