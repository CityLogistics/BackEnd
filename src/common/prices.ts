import { VehicleType } from 'src/drivers/entities/driver.entity';
import { Province } from 'src/orders/entities/order.entity';

export const regionalPrices = {
  [Province.ALBERTA]: 1600,
  [Province.BRITISH_COLUMBIA]: 1500,
  [Province.MANITOBA]: 1500,
  [Province.NEWFOUNDLAND_AND_LABRADOR]: 1500,
  [Province.NEW_BRUNSWICK]: 1500,
  [Province.NORTHWEST_TERRITORIES]: 1500,
  [Province.NOVA_SCOTIA]: 1500,
  [Province.NUNAVUT]: 1500,
  [Province.ONTARIO]: 1500,
  [Province.PRINCE_EDWARD_ISLAND]: 1500,
  [Province.QUEBEC]: 1500,
  [Province.SASKATCHEWAN]: 1500,
  [Province.YUKON]: 1500,
};

export const vehiclePrices = {
  [VehicleType.SALON]: 800,
  [VehicleType.FIVE_SEATER_SUV]: 1600,
  [VehicleType.SEVEN_SEATER_SUV]: 2000,
  [VehicleType.TRUCK]: 1800,
  [VehicleType.VAN]: 1700,
};

export const pricePerKm = 100;
