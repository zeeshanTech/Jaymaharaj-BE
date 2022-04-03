import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import {
  AuthInterceptor,
  MongooseClassSerializerInterceptor,
  User,
} from 'src/common';
import { LoginDto, RegisterDto } from './auth.dto';

import { AuthService } from './auth.service';

@UseInterceptors(MongooseClassSerializerInterceptor(User))
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() userData: RegisterDto) {
    try {
      return await this.authService.createUser(userData);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exist');
      }
    }
  }

  @Post('login')
  async login(
    @Body() authData: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findUser(
      { email: authData.userNameOrEmail } || {
        userName: authData.userNameOrEmail,
      },
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await compare(authData.password, user.password))) {
      throw new UnauthorizedException();
    }

    const tokenPayload = { id: user._id };
    const jwt = await this.jwtService.signAsync(tokenPayload);
    response.cookie('jwt', jwt, { httpOnly: true });

    const payload = {
      status: HttpStatus.ACCEPTED,
      message: 'Successfull Loged-in',
      data: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      },
    };
    return payload;
  }

  @Get('user')
  @UseInterceptors(AuthInterceptor)
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    const user = await this.authService.findUser({ id: data.id });
    const payload = {
      status: HttpStatus.OK,
      message: '',
      data: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    };
    return payload;
  }

  @Post('logout')
  @UseInterceptors(AuthInterceptor)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Logout successful!',
    };
  }
}
