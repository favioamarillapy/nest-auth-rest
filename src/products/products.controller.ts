import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService
  ) { }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.user)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.productsService.findAll(paginatioDto);
  }

  @Get(':search')
  @Auth(ValidRoles.admin, ValidRoles.user)
  findOne(@Param('search') search: string) {
    return this.productsService.findOnePlane(search);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post('upload')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1000 },
    storage: diskStorage({ destination: 'upload/products', filename: fileNamer }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    const secureUrl = `${this.configService.get('HOST_API')}/products/image/${file.filename}`;

    return { secureUrl };
  }

  @Get('image/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.productsService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

}
