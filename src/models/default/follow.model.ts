import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  ForeignKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { AccountUser } from '../index.model';

// 关注记录
@Table({
  modelName: 'follow_record',
  timestamps: true,
})
export class FollowRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('关注')
  @Column
  followUserId: number;

  @BelongsTo(() => AccountUser)
  followUser: AccountUser;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('被关注')
  @Column
  followerId: number;

  @BelongsTo(() => AccountUser)
  follower: AccountUser;

  @AllowNull(false)
  @Comment('true 关注 false 取消关注')
  @Default(true)
  @Column
  status: boolean;

  @AllowNull(false)
  @Comment('阅读状态 false未读 true 已读')
  @Default(false)
  @Column
  readStatus: boolean;
}
