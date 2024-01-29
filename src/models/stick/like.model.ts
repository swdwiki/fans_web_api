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
import { AccountUser, Sticks } from '../index.model';

// 专栏文章记录
@Table({
  modelName: 'stick_like_record',
  timestamps: true,
})
export class StickLikeRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @ForeignKey(() => Sticks)
  @Comment('喜欢的尺牍ID')
  @Column
  stickId: number;

  @BelongsTo(() => Sticks)
  stick: Sticks;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('点赞的人')
  @Column
  likeUserId: number;

  @BelongsTo(() => AccountUser)
  likeUser: AccountUser;

  @AllowNull(false)
  @Comment('true 点赞 false 取消点赞')
  @Default(true)
  @Column
  status: boolean;
}
