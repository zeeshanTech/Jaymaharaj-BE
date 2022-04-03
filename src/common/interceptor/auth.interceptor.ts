import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request:Request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];
    try {
      const auth = this.jwtService.verify(jwt)
      if(!auth){
        throw new UnauthorizedException()
      }
      return next.handle()
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
