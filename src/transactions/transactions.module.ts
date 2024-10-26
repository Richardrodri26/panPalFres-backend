import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsDetailsModule } from 'src/transactions-details/transactions-details.module';
import { TransactionsDetail } from 'src/transactions-details/entities/transactions-detail.entity';
import { Transaction } from './entities/transaction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsDetailsService } from 'src/transactions-details/transactions-details.service';
import { Product } from 'src/products/entities';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    TransactionsDetailsModule,
    TypeOrmModule.forFeature([ TransactionsDetail, Transaction, Product ]),
    AuthModule,
  ]
})
export class TransactionsModule {}
