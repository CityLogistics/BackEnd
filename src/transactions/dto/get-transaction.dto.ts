import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class GetTransactionDto {
  @IsOptional()
  @IsArray({})
  dates?: Date[];

  @IsOptional()
  @IsArray({})
  @IsEnum(TransactionStatus, {
    each: true,
  })
  status?: TransactionStatus[];

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
