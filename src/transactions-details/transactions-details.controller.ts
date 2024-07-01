import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsDetailsService } from './transactions-details.service';
import { CreateTransactionsDetailDto } from './dto/create-transactions-detail.dto';
import { UpdateTransactionsDetailDto } from './dto/update-transactions-detail.dto';

@Controller('transactions-details')
export class TransactionsDetailsController {
  constructor(private readonly transactionsDetailsService: TransactionsDetailsService) {}

  @Post()
  create(@Body() createTransactionsDetailDto: CreateTransactionsDetailDto) {
    return this.transactionsDetailsService.create(createTransactionsDetailDto);
  }

  @Get()
  findAll() {
    return this.transactionsDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionsDetailDto: UpdateTransactionsDetailDto) {
    return this.transactionsDetailsService.update(+id, updateTransactionsDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsDetailsService.remove(+id);
  }
}
