import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { MailService } from '../../default/mail/mail.service';
import {
  Account,
  AccountUser,
  ExpRecord,
  FireRecord,
  FollowRecord,
  Levels,
  PostLikeRecord,
  Posts,
  SigninRecord,
  StickLikeRecord,
  Sticks,
  regInvitCode,
} from '../../../models/index.model';
import moment from '../../../core/utils/moment';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import {
  RegisterAccountDto,
  changeMailDto,
  changePswDto,
  updateAvatarDto,
  changeProfileDto,
} from './dto_vo/account.dto';
import { getCode } from '../../../core/utils/utils';
import { RedisService } from '../../default/redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { makeSalt, encrypt, decrypt } from '../../../core/utils/password';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountService {
  constructor(
    // @InjectRedis() private readonly redis: Redis,
    @Inject(MailService)
    private mailService: MailService,

    @Inject(RedisService)
    private redisService: RedisService,

    private sequelize: Sequelize,

    private authService: AuthService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  // @Inject(MailService)
  // private mailService: MailService;

  // 发送邮件，生成邮件对应的redis数据
  // 发送邮件的通用代码，需要根据type辨别
  async setMailCode(sendMailInfo) {
    const { email, type } = sendMailInfo;
    if (
      !email ||
      !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
    ) {
      throw new HttpException('请输入正确的邮箱', 400);
    }
    const account = await Account.findOne({ where: { email } });
    if (account && type === 'reg') {
      throw new HttpException('该邮箱已绑定其他账号，请更换其他邮箱', 400);
    }
    const titleTypes = {
      reg: '轩辕天书社区账号注册',
      findPsw: '找回密码',
      changePsw: '修改密码',
      changeMail: '修改邮箱',
    };
    // 先验证邮箱是否注册过，如果注册过，就不发送，反过来告知已注册过该邮箱
    const result = await this.redisService.get(`captcha_${email}__${type}`);
    const code = result || String(getCode(6));
    const time = 10 * 60;
    if (!result) {
      this.redisService.set(`captcha_${email}__${type}`, code, time);
    }

    console.log(
      await this.redisService.get(`captcha_${email}__${type}`),
      'code',
    );

    const content = `${titleTypes[type]}验证码为：${code},有效期为${
      time / 60
    }分钟`;
    this.mailService.sendMail(
      email,
      titleTypes[type],
      titleTypes[type],
      content,
    );

    return true;
  }

  async checkEmailCode(
    email: string,
    code: string,
    type?: string,
  ): Promise<boolean> {
    if (!type) type = 'reg';
    const verifyCode = await this.redisService.get(`captcha_${email}__${type}`);
    if (!verifyCode || (verifyCode && verifyCode !== code)) {
      // throw new HttpException('验证码无效，请重新尝试', 400);
      return false;
    }
    return true;
  }

  async checkInvitCode(visitCode: string): Promise<boolean> {
    // const webSetting = await WebSetting.findOne({});
    // const codeInvitSwitch = webSetting.getDataValue('testInvit');
    const codeInvitSwitch = true;
    if (codeInvitSwitch) {
      const codeInvitInfo = await regInvitCode.findOne({
        where: {
          code: visitCode,
        },
      });
      if (!codeInvitInfo) {
        throw new HttpException('该邀请码不存在，请重新尝试', 400);
      }

      if (codeInvitInfo.getDataValue('bindAccountId')) {
        throw new HttpException('该邀请码已被使用', 400);
      }

      return true;
    }
    return false;
  }

  async reg(regInfo: RegisterAccountDto): Promise<any> {
    const { account, email, password, code, regType, nickname, invitCode } =
      regInfo;
    if (regType === 'code') {
      if (!code) {
        throw new HttpException('请输入注册验证码', 400);
      }
      const checkCodeRes = await this.checkEmailCode(email, code, 'reg');
      if (!checkCodeRes) {
        throw new HttpException('验证码无效，请重新尝试', 400);
      }
    }
    const invitCodeStatus = await this.checkInvitCode(invitCode);

    // 寻找账号

    const foundAccountWithEmail = await Account.findOne({
      where: {
        email,
      },
    });

    const foundAccountWithAccount = await Account.findOne({
      where: {
        account,
      },
    });

    if (foundAccountWithEmail) {
      throw new HttpException('邮箱已注册过，请更换邮箱', 400);
    }

    if (foundAccountWithAccount) {
      throw new HttpException('账号已经存在，请更换账号', 400);
    }

    const pswSalt = makeSalt();

    const psw = encrypt(password, pswSalt);

    try {
      const result = await this.sequelize.transaction(async (t) => {
        const accountInfo = await Account.create(
          {
            account,
            email,
            password: psw,
            pswSalt,
          },
          { transaction: t },
        );

        const user = await AccountUser.create(
          {
            accountId: accountInfo.getDataValue('accountId'),
            nickname:
              nickname ||
              '大眼蛙民_' + moment().format('YYYYMMDD') + String(getCode(6)),
            uuid: uuidv4().replace(/-/g, ''),
            avatar:
              'http://files.swdwiki.com/tos-cn-i-8vrofckkw9/avatar/custom_avatar.png',
          },
          { transaction: t },
        );

        // if (invitCodeStatus) {
        //   const updateRegInvitRes = await regInvitCode.update(
        //     {
        //       bindEmail: email,
        //       bindAccountId: accountInfo.getDataValue('accountId'),
        //     },
        //     {
        //       where: {
        //         code: invitCode,
        //       },
        //       transaction: t,
        //     },
        //   );
        // }

        return user;
      });

      return result;
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：注册错误，请联系网站管理员', 503);
    }
  }

  async login(loginForm: any): Promise<any> {
    const { account, password } = loginForm;

    const findAccount = await Account.findOne({
      where: {
        account,
      },
    });

    if (!findAccount) throw new NotFoundException('用户不存在');

    const inputPsw = encrypt(password, findAccount.getDataValue('pswSalt'));

    const comparePswRes: boolean =
      inputPsw === findAccount.getDataValue('password');

    if (!comparePswRes) throw new BadRequestException('密码不正确');

    const findUser = await AccountUser.findOne({
      where: {
        accountId: findAccount.getDataValue('accountId'),
      },
    });

    if (findAccount.getDataValue('isFrozen')) {
      throw new ForbiddenException('账号已被冻结，无法登录');
    }

    const payload = {
      account: findAccount.getDataValue('account'),
      accountId: findAccount.getDataValue('accountId'),
      userId: findUser.getDataValue('userId'),
    };

    return {
      accessToken: this.authService.getAccessToken(payload),
      refreshToken: this.authService.getRefreshToken(payload),
    };
  }

  async updateAvatar(updateAvatarForm: updateAvatarDto, userId: number) {
    const findAccountUser = await AccountUser.findByPk(userId);
    const { avatar } = updateAvatarForm;

    if (!findAccountUser) {
      throw new NotFoundException('账号不存在');
    }

    const updateRes = await AccountUser.update(
      {
        avatar,
      },
      {
        where: {
          userId,
        },
      },
    );

    return updateRes[0] > 0;
  }

  async updateProfile(changeProfileForm: changeProfileDto, userId: number) {
    const findAccountUser = await AccountUser.findByPk(userId);
    const { nickname, short, desc } = changeProfileForm;

    if (!findAccountUser) {
      throw new NotFoundException('账号不存在');
    }

    const updateRes = await AccountUser.update(
      {
        nickname,
        short,
        desc,
      },
      {
        where: {
          userId,
        },
      },
    );

    return updateRes[0] > 0;
  }

  async changePassword(changePswForm: changePswDto, accountId: number) {
    const findAccount = await Account.findByPk(accountId);
    const { email, code, password, newpass } = changePswForm;

    if (findAccount.getDataValue('email') !== email) {
      throw new ForbiddenException(
        '原邮箱与账号绑定邮箱不相同，无权限更改邮箱',
      );
    }

    if (
      code !== (await this.redisService.get(`captcha_${email}__changePsw`)) ||
      !(await this.redisService.get(`captcha_${email}__changePsw`))
    ) {
      throw new HttpException('验证码已失效，请重新获取验证码', 401);
    }

    // 对原密码进行加密，然后对比
    findAccount.getDataValue('password') === password;

    const oldPsw = encrypt(password, findAccount.getDataValue('pswSalt'));

    const comparePswRes: boolean =
      oldPsw === findAccount.getDataValue('password');
    if (!comparePswRes) {
      throw new ForbiddenException('输入的密码与原密码不一致，请输入争取密码');
    }

    const newPassword = encrypt(newpass, findAccount.getDataValue('pswSalt'));

    const updatePsw = await Account.update(
      {
        password: newPassword,
      },
      {
        where: {
          accountId,
        },
      },
    );

    return updatePsw[0] > 0;
  }

  async changeMail(changeEmailForm: changeMailDto, accountId: number) {
    const findAccount = await Account.findByPk(accountId);
    const { email, code, newemail } = changeEmailForm;
    if (findAccount.getDataValue('email') !== email) {
      throw new ForbiddenException(
        '原邮箱与账号绑定邮箱不相同，无权限更改邮箱',
      );
    }

    if (
      code !== (await this.redisService.get(`captcha_${email}__changeMail`)) ||
      !(await this.redisService.get(`captcha_${email}__changeMail`))
    ) {
      throw new HttpException('验证码已失效，请重新获取验证码', 401);
    }

    const updateEmail = await Account.update(
      {
        email: newemail,
      },
      {
        where: {
          accountId,
        },
      },
    );
    return updateEmail[0] > 0;
  }

  async getRefreshToken(refreshToken: string) {
    try {
      const { sub, userId } = this.jwtService.verify(refreshToken);
      const account = await Account.findByPk(sub);
      if (account.getDataValue('isFrozen')) {
        throw new ForbiddenException('账号已被冻结，无法登录');
      }
      const user = await AccountUser.findByPk(userId);
      if (
        user.getDataValue('accountId') !== account.getDataValue('accountId')
      ) {
        throw new BadRequestException('账号异常，请重新尝试');
      }

      const access_token = this.authService.getAccessToken({
        userId: user.getDataValue('userId'),
        account: account.getDataValue('accountId'),
        accountId: account.getDataValue('accountId'),
      });

      const refresh_token = this.authService.getAccessToken({
        userId: user.getDataValue('userId'),
        accountId: account.getDataValue('accountId'),
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  async getUserInfo(userinfo: any) {
    const { userId, accountId } = userinfo;
    console.log(accountId);

    // const userInfo = await AccountUser.findByPk(userId);
    const account = await Account.findByPk(accountId);

    // 获取增加的经验值
    const addExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'add',
        bindUserId: userId,
      },
    });

    // 获取减少的经验值
    const lowerExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'lower',
        bindUserId: userId,
      },
    });

    // 获取增加的黑火值
    const addFireCount = await FireRecord.sum('fire', {
      where: {
        addType: 'add',
        bindUserId: userId,
      },
    });

    // 获取减少的黑火值
    const lowerFireCount = await FireRecord.sum('fire', {
      where: {
        addType: 'lower',
        bindUserId: userId,
      },
    });

    // 黑火值累加
    const fireCount = addFireCount - lowerFireCount;

    const expCount = addExpCount - lowerExpCount;

    const myLevel = await Levels.findOne({
      where: {
        minExp: { [Op.lte]: expCount },
        maxExp: { [Op.gte]: expCount },
      },
    });

    const postLikeCount = await PostLikeRecord.count({
      where: {
        status: true,
      },
      include: [
        {
          model: Posts,
          as: 'post',
          where: {
            authorId: userId,
            state: 3,
          },
        },
      ],
    });

    const fanCount = await FollowRecord.count({
      where: {
        followerId: userId,
        status: true,
      },
    });

    const followCount = await FollowRecord.count({
      where: {
        followUserId: userId,
        status: true,
      },
    });

    const stickLikeCount = await StickLikeRecord.count({
      where: {
        status: true,
      },
      include: [
        {
          model: Sticks,
          as: 'stick',
          where: {
            authorId: userId,
            status: 2,
          },
        },
      ],
    });

    // 获取文章发布数量
    const postCount = await Posts.count({
      where: {
        authorId: userId,
        state: 3,
      },
    });

    // 获取尺牍发布数量
    const stickCount = await Sticks.count({
      where: {
        authorId: userId,
        status: 2,
      },
    });

    const now = dayjs().format('YYYY-MM-DD');
    const findTodaySignRecord = await SigninRecord.findOne({
      where: {
        signinTime: now,
        status: true,
        signinUserId: userId,
      },
    });

    return {
      // ...userInfo.dataValues,
      ...userinfo,
      todaySign: findTodaySignRecord ? true : false,
      level: myLevel,
      exp: expCount,
      fire: fireCount,
      email: account.getDataValue('email'),
      count: {
        follow: followCount,
        fan: fanCount,
        like: stickLikeCount + postLikeCount,
        stick: stickCount,
        post: postCount,
        work: 0,
      },
    };
  }
}
