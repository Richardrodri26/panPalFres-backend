import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsDetailsController } from './transactions-details.controller';
import { TransactionsDetailsService } from './transactions-details.service';

describe('TransactionsDetailsController', () => {
  let controller: TransactionsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsDetailsController],
      providers: [TransactionsDetailsService],
    }).compile();

    controller = module.get<TransactionsDetailsController>(TransactionsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
