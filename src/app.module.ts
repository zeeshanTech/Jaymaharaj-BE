import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    ResetPasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
