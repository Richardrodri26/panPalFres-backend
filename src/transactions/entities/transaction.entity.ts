import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    (user) => user.id,
    { eager: true }
  )
  user: User

  @OneToMany(
    () => TransactionsDetail,
    (transactionDetail) => transactionDetail.transaction,
    { eager: true }
  )
  transactionDetail: TransactionsDetail


}
