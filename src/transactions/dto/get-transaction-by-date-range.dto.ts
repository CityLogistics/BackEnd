import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class GetTransactionByDateRangeDto {
  @IsOptional()
  @IsDateString({})
  startDate: Date[];

  @IsOptional()
  @IsDateString({})
  endDate: Date[];

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
