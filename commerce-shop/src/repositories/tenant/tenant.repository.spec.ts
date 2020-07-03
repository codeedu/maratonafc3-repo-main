import { Test, TestingModule } from '@nestjs/testing';
import { TenantRepository } from './tenant.repository';

describe('TenantRepository', () => {
  let service: TenantRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantRepository],
    }).compile();

    service = module.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
