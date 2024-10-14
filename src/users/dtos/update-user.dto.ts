import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'password',
    'cities',
    'email',
    'driverId',
    'role',
    'province',
  ] as const),
) {}
