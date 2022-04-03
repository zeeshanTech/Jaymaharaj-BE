import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstName;

  @Prop({ type: String })
  lastName;

  @Prop({ type: String, required: true, unique: true })
  email;

  @Prop({ type: String, unique: true, default: null })
  userName;

  @Exclude()
  @Prop({ type: String, required: true })
  password;

  @Prop({ type: String })
  phone;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  let user: any = this;
  if (!user.isModified('password')) return next();
  genSalt(10, (err, salt) => {
    if (err) return next(err);

    hash(user.password, salt, (error, hash) => {
      if (error) return next(error);

      user.password = hash;
      next();
    });
  });
});
