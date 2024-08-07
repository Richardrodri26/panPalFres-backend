import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionsDetail } from '../transactions-details/entities/transactions-detail.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger('TransactionsService');

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionsDetail)
    private readonly transactionsDetailRepository: Repository<TransactionsDetail>,

    // private readonly transactionDetailService: TransactionsDetailsService
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    try {
      const transactionId = randomUUID();
      const transactionDetailId = randomUUID();

      console.log('transactionDetailId', transactionDetailId);

      // const transactionDetail = this.transactionsDetailRepository.create({
      //   id: transactionDetailId,
      //   transactions: [
      //     {
      //       id: transactionId,
      //       type: createTransactionDto.type,
      //       user,
      //       transactionDetail: {
      //         id: transactionDetailId,
      //         products: createTransactionDto.products,
      //       },
      //     },
      //   ],
      //   products: createTransactionDto.products,
      // });

      // // console.log('transactionsExample', transactionsExample)
      // console.log('transactionDetail', transactionDetail);

      // const transactionDetailDB =
      //   await this.transactionsDetailRepository.save(transactionDetail);

      // console.log('transactionDetailDB', transactionDetailDB);

      // const transactionDetail = await this.transactionDetailService.create({ products: createTransactionDto.products })

      const transaction = this.transactionRepository.create({
        // id: transactionId,
        type: createTransactionDto.type,
        user,
        // transactionDetail: transactionDetail,
      });
//a3ac8e59-a741-4646-8d7e-ba69d2d65d73
      const transactionDB = await this.transactionRepository.save(transaction);

      console.log('transaction', transaction)
      console.log('transactionDB', transactionDB)

      // return transaction;
      const details: TransactionsDetail[] = []

      createTransactionDto.products.map(product => {
        const transactionDetail = this.transactionsDetailRepository.create({
          transaction: 
            {
              id: transaction.id,
            },
          product: product,
        });
        details.push(transactionDetail)
      })

        const detailsDB = await this.transactionsDetailRepository.save(details)

      console.log('detailsDB', detailsDB)

        return transactionDB;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const transactions = await this.transactionRepository.find({
        take: limit,
        skip: offset,
        relations: {
          transactionDetail: true,
          user: true,
        },
      });

      console.log('transactions', transactions)

      return transactions;
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return `This action returns all transactions`;
  }

  async findOne(id: string, user: User) {
    try {
      const transaction = await this.transactionRepository.find({
        where: {
          id,
          user,
        },
        relations: ['transactionDetail'],
      });

      if (!transaction)
        throw new NotFoundException(`Transaction with id: ${id} not found`);

      return transaction;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
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
