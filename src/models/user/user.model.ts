import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  ForeignKey,
  BelongsTo,
  Default,
  DataType,
} from 'sequelize-typescript';
import { Account } from '../index.model';

// 用户信息
@Table({
  modelName: 'user',
  timestamps: true,
})
export class AccountUser extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  userId: number;

  // @AllowNull(false)
  @Column
  uuid: string;

  @AllowNull(false)
  @Comment('昵称')
  @Column
  nickname: string;

  @Comment('头像')
  @Column(DataType.TEXT)
  avatar: string;

  @Comment('十个字介绍')
  @Column
  short: string;

  @Comment('自我介绍')
  @Column(DataType.TEXT)
  desc: string;

  @ForeignKey(() => Account)
  @Comment('绑定AccountId')
  @Column
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;
}
