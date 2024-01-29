import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { AccountUser, Account, BanTypes } from '../../index.model';

// 用户黑名单
@Table({
  modelName: 'user_black_room',
  timestamps: true,
})
export class UserBlackRoom extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  blackId: number;

  @AllowNull(false)
  @Comment('是否永久封禁')
  @Default(false)
  @Column
  forever: boolean;

  @AllowNull(false)
  @Comment('封禁天数')
  @Column
  banDay: number;

  @AllowNull(false)
  @Comment('封禁开始日期')
  @Column
  banStartTime: Date;

  @AllowNull(false)
  @Comment('封禁结束日期')
  @Column
  banEndTime: Date;

  @AllowNull(false)
  @Comment('是否生效')
  @Default(true)
  @Column
  status: boolean;

  @Comment('其他封禁原因')
  @Column
  banOtherReason: string;

  @ForeignKey(() => BanTypes)
  @Column
  banTypeId: number;

  @BelongsTo(() => BanTypes)
  banReason: BanTypes;

  @ForeignKey(() => AccountUser)
  @Column
  userId: number;

  @BelongsTo(() => AccountUser)
  user: AccountUser;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;
}
