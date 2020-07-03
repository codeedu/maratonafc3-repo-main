import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodRepository } from './payment-method.repository';

describe('PaymentMethodRepository', () => {
  let service: PaymentMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMethodRepository],
    }).compile();

    service = module.get<PaymentMethodRepository>(PaymentMethodRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
