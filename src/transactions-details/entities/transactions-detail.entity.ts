import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "transactionDetail" })
export class TransactionsDetail {
  
  @ApiProperty({
    example: "cdde3ar3-3234-234234-cDse5",
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.transactionDetail,
    // { eager: true }
  )
  transactions: Transaction[];

  @OneToMany(
    () => Product,
    (product) => product,
    { eager: true }
  )
  products: Product[];
}
