import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class PasswordSetting {
  
  @Prop({ type: String, required: true, unique: true })
  email;

  @IsString()
  @Prop({type: String, required: true})
  token
}

export type PasswordSettingDocument = PasswordSetting & Document;
export const PasswordSettingSchema = SchemaFactory.createForClass(PasswordSetting);

