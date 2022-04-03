import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IForgotPassword, IUser, PasswordSetting, User } from 'src/common';
import { sendResetEmail } from 'src/utils';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel(PasswordSetting.name)
    private resetModel: Model<PasswordSetting>,

    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async resetPassword(resetValue: IForgotPassword) {
    try {
      const resetData = await new this.resetModel(resetValue);
      return resetData.save();
    } catch (error) {
      throw error;
    }
  }

  async emailVerification(email, token) {
    await sendResetEmail(email, token);
  }

  async removeResetData(email) {
    return await this.resetModel.findOneAndRemove({ email });
  }

  async findToken(token): Promise<IForgotPassword> {
    return await this.resetModel.findOne({ token });
  }

  async findUserByEmail(email) {
    return await this.userModel.findOne({ email });
  }

  async findAndUpdatePassword(id, password): Promise<IUser> {
    return await this.userModel.findByIdAndUpdate(
      id,
      { password },
      { new: true },
    );
  }
}
