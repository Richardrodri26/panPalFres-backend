import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionsDetail } from '../../transactions-details/entities/transactions-detail.entity';

@Entity({ name: "products" })
export class Product {

  @ApiProperty({
    example: "cdde3ar3-3234-234234-cDse5",
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "Teslo - T-shirt ",
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price'
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: "Descripcion de prueba",
    description: 'Product description',
    uniqueItems: null
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: "t_shirt_teslo",
    description: 'Product slug',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  // @ApiProperty({
  //   example: ["M", "XL"],
  //   description: 'Product sizes',
  // })
  // @Column('text', {
  //   array: true,
  // })
  // sizes: string[];

  // @ApiProperty({
  //   example: "women",
  //   description: 'Product gender',
  // })
  // @Column('text')
  // gender: string;

  // @ApiProperty()
  // @Column('text', {
  //   array: true,
  //   default: []
  // })
  // tags: string[];
  
  // @Column()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product, 
    { cascade: true, eager: true, nullable: true }
    )
  images?: ProductImage[]

  @OneToMany(
    () => TransactionsDetail,
    (transactionDetail) => transactionDetail.id, 
    )
  transactionDetails?: TransactionsDetail[]

  // @ManyToOne(
  //   () => User,
  //   (user) => user.product,
  //   { eager: true }
  // )
  // user: User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
    } 

    this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
  }
}
