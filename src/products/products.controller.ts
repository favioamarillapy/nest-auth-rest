import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.productsService.findAll(paginatioDto);
  }

  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.productsService.findOnePlane(search);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 1000 },
    storage: diskStorage({ destination: 'upload/products' })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    // 
    console.log(file);
  }

}
