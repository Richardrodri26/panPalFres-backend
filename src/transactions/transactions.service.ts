import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { randomUUID } from 'crypto';
import { TransactionsDetail } from 'src/transactions-details/entities/transactions-detail.entity';
import { TransactionsDetailsService } from 'src/transactions-details/transactions-details.service';

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
      const transactionDetailId = randomUUID()

      console.log('transactionDetailId', transactionDetailId)

      

      const transactionDetail = this.transactionsDetailRepository.create({
        id: transactionDetailId,
        transactions: [
          {
            id: transactionId,
            type: createTransactionDto.type,
            user,
            transactionDetail: {
              id: transactionDetailId,
              products: createTransactionDto.products
            }
          }
        ],
        products: createTransactionDto.products,
      });

      // console.log('transactionsExample', transactionsExample)
      console.log('transactionDetail', transactionDetail)

      
      const transactionDetailDB =
      await this.transactionsDetailRepository.save(transactionDetail);
      
      console.log('transactionDetailDB', transactionDetailDB)


      // const transactionDetail = await this.transactionDetailService.create({ products: createTransactionDto.products })

      const transaction = this.transactionRepository.create({
        id: transactionId,
        type: createTransactionDto.type,
        user,
        transactionDetail: transactionDetail,
      });

      await this.transactionRepository.save(transaction);

      return transaction;


    

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

      return transactions;
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return `This action returns all transactions`;
  }

  async findOne(id: string, user: User) {
    try {
      const transaction = await this.transactionRepository.findOne({
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
