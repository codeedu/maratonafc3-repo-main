import {Injectable} from '@nestjs/common';
import {BaseRepository} from "../base.repository";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
import {PaymentMethod} from "../../models/payment-method.model";

@Injectable()
export class PaymentMethodRepository extends BaseRepository<PaymentMethod,
    typeof PaymentMethod.prototype.id> {
    constructor(
        dataSource: EsDataSourceService,
    ) {
        super(PaymentMethod, dataSource);
    }
}

