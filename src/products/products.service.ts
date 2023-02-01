import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate } from 'uuid';
import { Product, ProductImage } from './entities';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetail } = createProductDto;

      const product = this.productRepository.create({
        ...productDetail,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const products = await this.productRepository.find({
      take: paginatioDto.limit,
      skip: paginatioDto.offset,
      relations: { images: true }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
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

  async findOnePlane(search: string) {
    const { images = [], ...product } = await this.findOne(search);

    return {
      ...product,
      images: images.map(img => img.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    const { images, ...productToUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productToUpdate
    });

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();


      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map(
          img => this.productImageRepository.create({ url: img })
        );
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlane(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder('products');

    try {
      return await query
        .delete()
        .where({});

    } catch (error) {

      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  getStaticProductImage(imageName: string) {

    const path = join(__dirname, '../../upload/products', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No product found with image ${imageName}`);

    return path;
  }
}
