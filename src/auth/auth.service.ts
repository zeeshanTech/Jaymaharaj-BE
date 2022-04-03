import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User } from 'src/common';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: RegisterDto) {
    const user = await new this.userModel(userData);
    return await user.save();
  }

  async findUser(userValue): Promise<IUser>{
    return await this.userModel.findOne(userValue);
  }
}
