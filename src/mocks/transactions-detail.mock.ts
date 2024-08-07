import { ProductMock } from "./product.mock";
import { TransactionMock } from "./transaction.mock";

export class TransactionsDetailMock {
  id = 'mocked-id';
  quantity = 10;
  transaction = new TransactionMock();
  product = new ProductMock();
}