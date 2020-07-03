import {Injectable, NestMiddleware, NotFoundException} from '@nestjs/common';
import {Request, Response} from 'express';
import {TenantService} from "../services/tenant/tenant.service";

@Injectable()
export class TenantMiddleware implements NestMiddleware {

    constructor(private tenantService: TenantService) {
    }

    async use(req: Request, res: Response, next: () => void) {
        try {
            await this.tenantService.setTenantBy(req.hostname);
        }catch (e) {
            console.error(e);
            throw new NotFoundException('Site not found');
        }
        next();
    }
}
