import { IsArray, IsString, MinLength } from "class-validator";
import { Product } from "src/products/entities";

export class CreateTransactionDto {
  @IsString()
  @MinLength(1)
  type: string;

  @IsArray()
  products: Product[]
}
