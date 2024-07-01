import { IsArray } from "class-validator";
import { Product } from "src/products/entities";

export class CreateTransactionsDetailDto {
  @IsArray()
  products: Product[]
}
