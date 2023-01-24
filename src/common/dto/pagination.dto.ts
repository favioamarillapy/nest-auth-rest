import { Type } from 'class-transformer';
import { Min, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    offset?: number;
}