import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserCitiesDto extends PickType(CreateUserDto, [
  'cities',
] as const) {}
