import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Product, ProductImage } from './products/entities';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { TransactionsModule } from './transactions/transactions.module';

import { TransactionsDetailsModule } from './transactions-details/transactions-details.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    AuthModule,
    TransactionsModule,
    // TypeOrmModule.forFeature([User, Product, ProductImage]),
    // TypeOrmModule.forFeature([TransactionDetail]),
    TransactionsDetailsModule,
  ],
})
export class AppModule {}