// import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

// export class ZodValidationPipe implements PipeTransform {
//   constructor(private schema: ZodSchema) {}

//   transform(value: unknown, metadata: ArgumentMetadata) {
//     try {
//       const parsedValue = this.schema.parse(value);
//       return value;
//     } catch (error) {
//       throw new BadRequestException('Validation failed');
//     }
//   }
// }
