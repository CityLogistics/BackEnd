import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TokenPurpose {
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Schema({ timestamps: true })
export class Token {
  @Prop()
  email: string;

  @Prop()
  token: string;

  @Prop()
  purpose: TokenPurpose;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
