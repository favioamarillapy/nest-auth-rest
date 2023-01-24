import { IsString } from "class-validator";
import { IsIn, IsNumber, IsOptional, IsPositive, MinLength } from "class-validator";

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
    @IsOptional()
    sizes: string[];

    @IsString()
    @IsIn(['men', 'woman', 'children'])
    gender: string;

    @IsString({ each: true })
    @IsOptional()
    tags: string[];
}
