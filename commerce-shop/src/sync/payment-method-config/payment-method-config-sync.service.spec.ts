import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodConfigSyncService } from './payment-method-config-sync.service';

describe('PaymentMethodConfigSyncService', () => {
  let service: PaymentMethodConfigSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMethodConfigSyncService],
    }).compile();

    service = module.get<PaymentMethodConfigSyncService>(PaymentMethodConfigSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
