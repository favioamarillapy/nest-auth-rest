import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  findAll(paginatioDto: PaginationDto) {
    return this.productRepository.find({
      take: paginatioDto.limit,
      skip: paginatioDto.offset
    });
  }

  async findOne(search: string) {
    let product: Product;

    if (validate(search)) {
      product = await this.productRepository.findOneBy({ id: search });
    } else {
      product = await this.productRepository.findOneBy({ slug: search });
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    try {
      this.productRepository.save(product);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
  }
}
