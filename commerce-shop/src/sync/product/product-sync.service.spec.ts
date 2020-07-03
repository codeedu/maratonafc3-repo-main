import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncService } from './product-sync.service';

describe('ProductSyncService', () => {
  let service: ProductSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSyncService],
    }).compile();

    service = module.get<ProductSyncService>(ProductSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
