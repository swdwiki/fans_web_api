// src/logical/auth/auth.service.ts
import { Injectable, Inject } from '@nestjs/common';
// import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { defaultConfig } from '../../../config/default.config';
// import { encryptPassword } from '../../utils/cryptogram';

@Injectable()
export class AuthService {
  constructor(
    // private readonly usersService: UserService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  // JWT验证 - Step 2: 校验用户信息
  // async validateUser(username: string, password: string): Promise<any> {
  //   console.log('JWT验证 - Step 2: 校验用户信息');
  //   const user = await this.usersService.findOne(username);
  //   if (user) {
  //     const hashedPassword = user.password;
  //     const salt = user.salt;
  //     // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
  //     const hashPassword = encryptPassword(password, salt);
  //     if (hashedPassword === hashPassword) {
  //       // 密码正确
  //       return {
  //         code: 1,
  //         user,
  //       };
  //     } else {
  //       // 密码错误
  //       return {
  //         code: 2,
  //         user: null,
  //       };
  //     }
  //   }
  //   // 查无此人
  //   return {
  //     code: 3,
  //     user: null,
  //   };
  // }

  // JWT验证 - Step 3: 处理 jwt 签证
  // async certificate(user: any) {
  //   const payload = {
  //     username: user.username,
  //     sub: user.userId,
  //     realName: user.realName,
  //     role: user.role,
  //   };
  //   console.log('JWT验证 - Step 3: 处理 jwt 签证');
  //   try {
  //     const token = this.jwtService.sign(payload);
  //     return {
  //       code: 200,
  //       data: {
  //         token,
  //       },
  //       msg: `登录成功`,
  //     };
  //   } catch (error) {
  //     return {
  //       code: 600,
  //       msg: `账号或密码错误`,
  //     };
  //   }
  // }

  getAccessToken(payload) {
    const { account, accountId, userId } = payload;
    return this.jwtService.sign(
      {
        account,
        sub: accountId,
        userId,
      },
      {
        // expiresIn: '1s',
        expiresIn: defaultConfig.jwt_access_token_expires_time,
      },
    );
  }

  getRefreshToken(payload) {
    const { userId, accountId } = payload;
    return this.jwtService.sign(
      {
        sub: accountId,
        userId,
      },
      {
        expiresIn: defaultConfig.jwt_refresh_token_expires_time,
      },
    );
  }
}
