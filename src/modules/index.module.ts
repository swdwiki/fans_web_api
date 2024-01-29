import { SequelizeModule } from '@nestjs/sequelize';
import { WebPostModule } from '../modules/web/post/post.module';
import { AdminPostModule } from '../modules/admin/post/post/post.module';
import { WebAccountModule } from '../modules/web/account/account.module';
import { AdminAccountModule } from '../modules/admin/account/account.module';
import { LoginLogModule } from '../modules/web/loginLog/loginLog.module';
import { WebSettingModule } from '../modules/admin/web-setting/web-setting.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import * as models from '../models/index.model';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '../core/filters/http-exception.filter';
import { TransformInterceptor } from '../core/interceptor/transform.interceptor';
import { MaileModule } from './default/mail/mail.module';
import { AuthModule } from './web/auth/auth.module';
import { PublicAuthGuard } from './default/guard/public.guard';
import { AdminAuthGuard } from './default/guard/admin.guard';
import { WebTagModule } from './web/tag/tag.module';
import { WebColumnsModule } from './web/post/columns/columns.module';
import { WebStickModule } from './web/stick/stick.module';
import { WebReportModule } from './web/report/report.module';
import { WebFollowModule } from './web/follow/follow.module';
import { WebUserModule } from './web/user/user.module';
import { WebSigninModule } from './web/user/signin/signin.module';
import { WebExpModule } from './web/exp/exp.module';
import { defaultConfig } from '../config/default.config';
// import { LoginAuthGuard } from './default/guard/login.guard';

const allModels = [];
for (const key in models) {
  if (Object.prototype.hasOwnProperty.call(models, key)) {
    const element = models[key];
    allModels.push(element);
  }
}

export const modules = [
  WinstonModule.forRootAsync({
    useFactory() {
      return {
        transports: [
          new winston.transports.DailyRotateFile({
            dirname: `log`, // 日志保存的目录
            filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
            datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
            zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
            maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
            maxFiles: '30d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
            // 记录时添加时间戳信息
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.json(),
            ),
          }),
        ],
      };
    },
  }),
  WebPostModule,
  AdminPostModule,
  AdminAccountModule,
  LoginLogModule,
  WebAccountModule,
  WebSettingModule,
  MaileModule,
  RedisModule,
  AuthModule,
  WebTagModule,
  WebColumnsModule,
  WebStickModule,
  WebReportModule,
  WebFollowModule,
  WebUserModule,
  WebSigninModule,
  WebExpModule,
  JwtModule.registerAsync({
    global: true,
    useFactory() {
      return {
        secret: defaultConfig.jwt_secret,
        signOptions: {
          issuer: 'SWDWIKI 轩辕天书',
          expiresIn: defaultConfig.jwt_access_token_expires_time,
        },
      };
    },
  }),
  SequelizeModule.forRootAsync({
    useFactory() {
      return {
        dialect: 'mysql',
        host: defaultConfig.database.mysql_server_host,
        port: defaultConfig.database.mysql_server_port,
        username: defaultConfig.database.mysql_server_username,
        password: defaultConfig.database.mysql_server_password,
        database: defaultConfig.database.mysql_server_database,
        models: allModels,
        logging: true, // 关闭打印
        autoLoadModels: true,
        synchronize: true,
        define: {
          timestamps: true, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
          paranoid: true, // 是否自动创建deletedAt字段
          underscored: true, // 开启下划线命名方式，默认是驼峰命名
          freezeTableName: true, // 禁止修改表名
          charset: 'utf8mb4',
        },
      };
    },
  }),
];

export const providers: any = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
  {
    provide: APP_GUARD,
    useClass: PublicAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: AdminAuthGuard,
  },
];
