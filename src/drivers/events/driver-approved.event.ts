import { Driver } from '../entities/driver.entity';

export class DriverApprovedEvent {
  driver: Driver;
  password: string;
}
