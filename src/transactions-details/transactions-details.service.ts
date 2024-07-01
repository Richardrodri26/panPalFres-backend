import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTransactionsDetailDto } from './dto/create-transactions-detail.dto';
import { UpdateTransactionsDetailDto } from './dto/update-transactions-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsDetail } from './entities/transactions-detail.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionsDetailsService {
  private readonly logger = new Logger('TransactionsDetailsService');
  constructor(

    // @InjectRepository(TransactionsDetail)
    // private readonly transactionsDetailRepository: Repository<TransactionsDetail>,

    
  ) {}


  async create(createTransactionsDetailDto: CreateTransactionsDetailDto) {
    // try {
    //   const transactionDetailId = randomUUID()

    //   const transactionDetail = this.transactionsDetailRepository.create({
    //     id: transactionDetailId,
    //     // transactions: {
    //     //   id: transactionId,
    //     //   type: createTransactionDto.type,
    //     //   user,
    //     // },
    //     products: createTransactionsDetailDto.products,
    //   });

    //   const transactionDetailDB =
    //     await this.transactionsDetailRepository.save(transactionDetail);

    //     return transactionDetailDB
    // } catch (error) {
    //   this.handleDBExceptions(error);
    // }
  }

  findAll() {
    return `This action returns all transactionsDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionsDetail`;
  }

  update(id: number, updateTransactionsDetailDto: UpdateTransactionsDetailDto) {
    return `This action updates a #${id} transactionsDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionsDetail`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }
}
