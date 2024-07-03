import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
