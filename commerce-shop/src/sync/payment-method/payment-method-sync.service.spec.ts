import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodSyncService } from './payment-method-sync.service';

describe('PaymentMethodSyncService', () => {
  let service: PaymentMethodSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMethodSyncService],
    }).compile();

    service = module.get<PaymentMethodSyncService>(PaymentMethodSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
