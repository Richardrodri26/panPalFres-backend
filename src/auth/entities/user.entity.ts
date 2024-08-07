import { forwardRef } from "@nestjs/common";
import { Transaction } from "../../transactions/entities/transaction.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('text')
  fullName:  string;

  @Column('bool', {
    default: true
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  // @OneToMany(
  //   () => Product,
  //   (product) => product.user
  // )
  // product: Product;

  // @OneToMany(
  //   () => Transaction,
  //   (transaction) => transaction.user
  // )

  // @OneToMany(() => forwardRef(() => Transaction), (transaction) => transaction.user)

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert()
  }

}