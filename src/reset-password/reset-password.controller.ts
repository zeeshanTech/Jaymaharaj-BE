import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { hash } from 'bcrypt';
import { GetRandomString } from 'src/utils';
import { setTimeout } from 'timers';
import { ForgotDto, ResetPasswordDto } from './password.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller()
export class ResetPasswordController {
  constructor(
    private resetService: ResetPasswordService,
    private mailService: MailerService,
  ) {}

  @Post('forgot')
  async forgot(@Body() forgot: ForgotDto) {
    try {
      const email = forgot.email;
      const token = GetRandomString(6);
      const resetPayload = {
        email,
        token,
      };
      await this.resetService.resetPassword(resetPayload);
      const url = `${process.env.REDIRECT_URI_DEV}/${token}`;
      this.mailService.sendMail({
        to: email,
        subject: 'Reset your password!',
        html: `Click <a href="${url}">here</a> to reset your password!`,
      });
      setTimeout(() => {
        this.resetService.removeResetData(email);
      }, 120000);
      return {
        message: 'Check your email!',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('reset')
  async reset(@Body() resetValue: ResetPasswordDto) {
    try {
      const resetUser = await this.resetService.findToken(resetValue.token);
    const email = resetUser.email;
    const user = await this.resetService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const hashPassword = await hash(resetValue.password, 10);
    await this.resetService.findAndUpdatePassword(user.id, hashPassword)
    return {
      message: 'success'
    }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException();
    }
  }
}
