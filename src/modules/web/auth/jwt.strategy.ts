import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account, AccountUser } from '../../../models/index.model';
import { defaultConfig } from '../../../config/default.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 获取请求header token值
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: defaultConfig.jwt_secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<any> {
    //payload：jwt-passport认证jwt通过后解码的结果
    const account = await Account.findByPk(payload.sub);
    if (account.getDataValue('isFrozen')) {
      throw new ForbiddenException('账号已被冻结');
    }
    const user = await AccountUser.findOne({
      where: {
        userId: payload.userId,
      },
      attributes: {
        exclude: ['createdAt', 'deletedAt', 'updatedAt'],
      },
    });
    // payload.userId
    return {
      account: payload.account,
      accountId: payload.sub,
      userId: payload.userId,
      ...user.dataValues,
    };
  }
}
