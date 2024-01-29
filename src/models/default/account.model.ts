import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  HasOne,
} from 'sequelize-typescript';
import { AccountUser } from '../index.model';

// 账号
@Table({
  modelName: 'account',
  timestamps: true,
})
export class Account extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  accountId: number;

  @AllowNull(false)
  @Comment('账号')
  @Column
  account: string;

  @AllowNull(false)
  @Comment('密码')
  @Column
  password: string;

  @AllowNull(false)
  @Comment('密码盐')
  @Column
  pswSalt: string;

  @AllowNull(false)
  @Comment('邮箱')
  @Column
  email: string;

  @Comment('绑定手机号')
  @Column
  phone: string;

  // @Comment('是否为管理员')
  // @Column
  // isAdmin: boolean;

  @Comment('是否冻结账号')
  @Column
  isFrozen: boolean;

  @HasOne(() => AccountUser)
  user: AccountUser;
}
