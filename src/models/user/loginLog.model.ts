import {
  Column,
  Model,
  Table,
  AllowNull,
  Comment,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Account } from '../index.model';

// 登录日志
@Table({
  modelName: 'login_log',
  timestamps: true,
})
export class LoginLog extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @Comment('登录平台 admin web')
  @Column
  loginType: string;

  @AllowNull(false)
  @Comment('登录时间')
  @Column
  get loginTime(): string {
    return this.getDataValue('loginTime');
  }
  set loginTime(value: string) {
    const now = Math.floor(new Date().valueOf() / 1000);
    this.setDataValue('loginTime', value || now);
  }

  @Comment('登录IP地址')
  @Column
  ipAddress: string;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;
}
