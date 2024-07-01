import { Module } from '@nestjs/common';
import { TransactionsDetailsService } from './transactions-details.service';
import { TransactionsDetailsController } from './transactions-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Module({
  controllers: [TransactionsDetailsController],
  providers: [TransactionsDetailsService],
  imports: [
    TypeOrmModule.forFeature([ Transaction ]),
  ],
  
})
export class TransactionsDetailsModule {}
