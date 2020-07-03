import {SetMetadata} from "@nestjs/common";

export const Tenant = () => SetMetadata('tenant', true);
