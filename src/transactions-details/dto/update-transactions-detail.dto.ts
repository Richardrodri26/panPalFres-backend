import { PartialType } from '@nestjs/swagger';
import { CreateTransactionsDetailDto } from './create-transactions-detail.dto';

export class UpdateTransactionsDetailDto extends PartialType(CreateTransactionsDetailDto) {}
