import { Test, TestingModule } from '@nestjs/testing';
import { TenantSyncService } from './category-sync.service';

describe('TenantSyncService', () => {
  let service: TenantSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantSyncService],
    }).compile();

    service = module.get<TenantSyncService>(TenantSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
