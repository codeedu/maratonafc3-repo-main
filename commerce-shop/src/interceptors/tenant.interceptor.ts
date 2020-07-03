import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import {TenantService} from "../services";
import {Reflector} from "@nestjs/core";

@Injectable()
export class TenantInterceptor implements NestInterceptor {

  constructor(
      private reflector: Reflector,
      private tenantService: TenantService
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const hasDecorator = this.hasDecorator(context);

    return next
        .handle()
        .pipe(
            map(responseData => {
              if (hasDecorator) {
                return {
                  ...responseData,
                  tenant: this.tenantService.tenant
                }
              }
              return responseData;
            })
        )
        ;
  }

  hasDecorator(context: ExecutionContext) {
    return this.reflector.get('tenant', context.getHandler());
  }

}
