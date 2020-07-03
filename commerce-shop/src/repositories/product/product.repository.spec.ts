import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';

describe('ProductRepository', () => {
  let service: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRepository],
    }).compile();

    service = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
