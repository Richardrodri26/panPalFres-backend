import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsDetailsService } from './transactions-details.service';

describe('TransactionsDetailsService', () => {
  let service: TransactionsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsDetailsService],
    }).compile();

    service = module.get<TransactionsDetailsService>(TransactionsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
