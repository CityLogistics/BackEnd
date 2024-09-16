import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

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

  @IsOptional()
  @IsArray({})
  @IsEnum(TransactionType, {
    each: true,
  })
  transactionType?: TransactionType[];

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
