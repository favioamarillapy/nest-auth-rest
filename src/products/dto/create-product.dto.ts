import { IsString } from "class-validator";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(5)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes: string[];

    @IsString()
    @IsIn(['men', 'woman', 'children'])
    gender: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
