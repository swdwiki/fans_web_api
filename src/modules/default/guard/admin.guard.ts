import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  IS_ADMIN_KEY,
  IS_PUBLIC_KEY,
} from '../../../decorator/default.decorator';
import { JwtService } from '@nestjs/jwt';
// import { Account } from '../../../models/index.model';
import { UserBlackRoom } from '../../../models/index.model';
import { Op } from 'sequelize';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  // export class PublicAuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private reflector: Reflector,

    @Inject(JwtService)
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAdmin) return true;
    else {
      const authorization = request.headers.authorization;

      if (!authorization) {
        throw new UnauthorizedException('用户未登录');
      } else {
        try {
          const token = authorization.split(' ')[1];
          const data = this.jwtService.verify(token);
          console.log(data);
          return super.canActivate(context);
        } catch (e) {
          throw new UnauthorizedException('token失效，请重新登录S');
        }
      }
    }
  }
}
