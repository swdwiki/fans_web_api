import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Account, AccountUser } from '../index.model';

// 账号
@Table({
  modelName: 'reg_invit_code',
  timestamps: true,
})
export class regInvitCode extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  codeId: number;

  @AllowNull(false)
  @Comment('邀请码')
  @Column
  code: string;

  @Comment('邀请的邮箱')
  @Column
  visitEmail: string;

  @Comment('有效截止日期')
  @Column
  endTime: string;

  @ForeignKey(() => Account)
  @Comment('绑定AccountId')
  @Column
  bindAccountId: number;

  @BelongsTo(() => Account)
  bindAccount: Account;
}
