import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) { }

  async seed() {
    return await this.insertProducts();
  }

  private async insertProducts() {
    await this.productsService.removeAll();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    })

    await Promise.all(insertPromises);


    return `Executed successfully`;
  }

}
