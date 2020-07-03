import { Test, TestingModule } from '@nestjs/testing';
import { CategorySyncService } from './category-sync.service';

describe('CategorySyncService', () => {
  let service: CategorySyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorySyncService],
    }).compile();

    service = module.get<CategorySyncService>(CategorySyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
