import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('api');
  await app.useGlobalPipes(new ValidationPipe());
  await app.use(cookieParser());
  await app.enableCors();
  await app.listen(3000);
}
bootstrap();
