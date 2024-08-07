import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { TransactionsDetail } from "../../transactions-details/entities/transactions-detail.entity";
import { forwardRef } from "@nestjs/common";


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


  // @ManyToOne(
  //   () => User,
  //   (user) => user.transactions,
  //   { eager: true }
  // )

  // @ManyToOne(() => forwardRef(() => User), (user) => user.transactions, { eager: true })

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  user: User

  @OneToMany(
    () => TransactionsDetail,
    (transactionDetail) => transactionDetail.transaction,
    { eager: true }
  )
  transactionDetail: TransactionsDetail


}
