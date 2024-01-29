import {
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
import { IS_BAN_KEY } from '../../../decorator/default.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserBlackRoom } from '../../../models/index.model';
import { Op } from 'sequelize';

@Injectable()
// export class BanAuthGuard extends AuthGuard('jwt') {
export class PublicAuthGuard implements CanActivate {
  //   constructor(
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;
  //   ) {
  //     // super();
  //   }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isBan = this.reflector.getAllAndOverride<boolean>(IS_BAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isBan) return true;
    else {
      const authorization = request.headers.authorization;

      if (!authorization) {
        throw new UnauthorizedException('用户未登录');
      } else {
        try {
          const token = authorization.split(' ')[1];
          const data = this.jwtService.verify(token);
          console.log(data);

          UserBlackRoom.findOne({
            where: {
              accountId: data.sub,
              userId: data.userId,
              banStartTime: {
                [Op.gt]: new Date(),
              },
              banEndTime: {
                [Op.lt]: new Date(),
              },
            },
          }).then((res) => {
            console.log(res, 'dasds');
            if (!res) {
              return true;
            } else {
              throw new UnauthorizedException(
                '账号已被封禁，请解封后再操作，或进行申诉',
              );
            }
          });
        } catch (e) {
          throw new UnauthorizedException('登录凭证失效，请重新登录');
        }
      }
    }
  }
}
