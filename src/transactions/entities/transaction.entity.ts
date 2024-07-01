import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionsDetail } from "src/transactions-details/entities/transactions-detail.entity";


@Entity({ name: "transactions" })
export class Transaction {

  @ApiProperty({
    example: "cdde3ar3-3234-234234-cDse5",
    description: 'Transaction  ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: true,
  })
  type: string;


  @ManyToOne(
    () => User,
    (user) => user.transactions,
    { eager: true }
  )
  user: User

  @ManyToOne(
    () => TransactionsDetail,
    (transactionDetail) => transactionDetail.transactions,
    { eager: true }
  )
  transactionDetail: TransactionsDetail


}
