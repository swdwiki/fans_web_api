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
import { AccountUser, Posts } from '../index.model';

// 专栏文章记录
@Table({
  modelName: 'post_like_record',
  timestamps: true,
})
export class PostLikeRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @ForeignKey(() => Posts)
  @Comment('喜欢的文章ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

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
