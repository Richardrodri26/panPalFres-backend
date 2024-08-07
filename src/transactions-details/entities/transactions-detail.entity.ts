import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: "transactionDetail" })
export class TransactionsDetail {
  
  @ApiProperty({
    example: "cdde3ar3-3234-234234-cDse5",
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.id,
    // { eager: true }
  )
  transaction: Transaction;

  @ApiProperty({
    example: 10,
    description: 'quantity',
    default: 0
  })
  @Column('int', {
    default: 0,
  })
  quantity: number;

  @ManyToOne(
    () => Product,
    (product) => product.id,
    { eager: true }
  )
  product: Product;
}
