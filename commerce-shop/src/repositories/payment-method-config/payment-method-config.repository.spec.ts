import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodConfigRepository } from './payment-method-config.repository';

describe('PaymentMethodConfigRepository', () => {
  let service: PaymentMethodConfigRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMethodConfigRepository],
    }).compile();

    service = module.get<PaymentMethodConfigRepository>(PaymentMethodConfigRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
