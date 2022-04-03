import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PasswordSetting,
  PasswordSettingSchema,
  User,
  UserSchema,
} from 'src/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordSetting.name, schema: PasswordSettingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3',
        },
        auth: {
          user: 'noreplay@jaymaharaj.org',
          pass: '8200583170@Jay',
        },
      },
      defaults: {
        from: {
          address: 'noreplay@jaymaharaj.org',
          name: 'No Replay',
        },
      },
    }),
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
