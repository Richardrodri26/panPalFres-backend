import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { Transaction } from "./entities/transaction.entity";
import { TransactionsDetail } from "../transactions-details/entities/transactions-detail.entity";
import { User } from "../auth/entities/user.entity";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { Product } from "src/products/entities";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger("TransactionsService");

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TransactionsDetail)
    private readonly transactionsDetailRepository: Repository<TransactionsDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // private readonly transactionDetailService: TransactionsDetailsService
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    try {
      const transaction = this.transactionRepository.create({
        type: createTransactionDto.type,
        user,
      });
      const transactionDB = await this.transactionRepository.save(transaction);

      let details: TransactionsDetail[] = [];

      // console.log('createTransactionDto', createTransactionDto)

      // createTransactionDto.products.forEach(async (product) => {
      //   // const currentProduct = await this.productRepository.findOneBy({ id: product.id,  });

      //   const currentProduct = await this.productRepository.findOne({
      //     where: { id: product.id },
      //     relations: ["images"], // Asegúrate de incluir las relaciones necesarias
      //   });

      //   if (!currentProduct) {
      //     throw new NotFoundException(
      //       `No se encontro el producto con id: ${product.id}`,
      //     );
      //   }

      //   const currentStock = currentProduct.stock - product.stock;

      //   // console.log('currentStock', currentStock)
      //   // console.log('currentProduct', currentProduct)

      //   if (currentStock < 0) {
      //     throw new Error(
      //       `No hay suficiente stock para el producto: ${product.title}`,
      //     );
      //   }

      //   currentProduct.stock = currentStock;
      //   currentProduct.images = product.images || [];

      //   // await this.productRepository.update({id: product.id}, {
      //   //   ...currentProduct,
      //   //   stock: currentStock,
      //   //   images: product.images || []
      //   // })

      //   // await this.productRepository.save({
      //   //   ...currentProduct,
      //   //   stock: currentStock
      //   // })
      //   await this.productRepository.save(currentProduct);

      //   const transactionDetail = await this.transactionsDetailRepository.create({
      //     transaction: {
      //       id: transaction.id,
      //     },
      //     product: {
      //       ...product,
      //       stock: currentStock,
      //     },
      //   });

      //   console.log('transactionDetail', transactionDetail)

      //   details.push(transactionDetail);

      // });

      // Recorre todos los productos de manera secuencial
      for (const product of createTransactionDto.products) {
        const currentProduct = await this.productRepository.findOne({
          where: { id: product.id },
          relations: ["images"], // Incluye las relaciones necesarias
        });

        if (!currentProduct) {
          throw new NotFoundException(
            `No se encontró el producto con id: ${product.id}`,
          );
        }

        const currentStock =
          createTransactionDto.type === "ingreso"
            ? currentProduct.stock + product.stock
            : currentProduct.stock - product.stock;

        if (currentStock < 0) {
          throw new Error(
            `No hay suficiente stock para el producto: ${product.title}`,
          );
        }

        // Actualizar el producto con el nuevo stock
        currentProduct.stock = currentStock;
        currentProduct.images = product.images || []; // Asegúrate de manejar bien las imágenes

        await this.productRepository.save(currentProduct);

        const transactionDetail = this.transactionsDetailRepository.create({
          transaction: { id: transaction.id },
          product: { ...product, stock: currentStock },
          quantity: product.stock,
        });

        details.push(transactionDetail); // Acumula los detalles
      }

      const detailsDB = await this.transactionsDetailRepository.save(details);

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
        relations: ["transactionDetail"],
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
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      "Unexpected error, check server log",
    );
  }
}
