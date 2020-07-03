import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {CategoryRepository} from "../repositories";
import {Reflector} from "@nestjs/core";
import {map} from "rxjs/operators";

@Injectable()
export class CategoriesDefaultInterceptor implements NestInterceptor {

    constructor(
        private reflector: Reflector,
        private categoryRepo: CategoryRepository
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler){
        let categories;
        const hasDecorator = this.hasDecorator(context);
        if (hasDecorator) {
            categories = await this.categoryRepo.find({
                order: ['name.keyword DESC']
            })

        }
        return next.handle()
            .pipe(
                map(responseData => {
                    if(hasDecorator) {
                        return {
                            ...responseData,
                            ...(categories && {categories})
                        };
                    }

                    return responseData
                })
            );
    }

    hasDecorator(context: ExecutionContext) {
        return this.reflector.get('categories-default', context.getHandler());
    }
}
