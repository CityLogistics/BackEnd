import { BadRequestException, PipeTransform } from '@nestjs/common';
import mongoose from 'mongoose';

export class ObjectIdPipe implements PipeTransform {
  constructor(private field?: string) {}
  transform(value: any) {
    if (!mongoose.Types.ObjectId.isValid(value))
      throw new BadRequestException(
        `invalid ${this.field ?? 'argument'} ${value}`,
      );
    return value;
  }
}
