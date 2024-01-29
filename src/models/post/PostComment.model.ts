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
  Default,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { AccountUser, PostCommentsReply, Posts } from '../index.model';

// 帖子评论
@Table({
  modelName: 'post_comment',
  timestamps: true,
})
export class PostComments extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  commentId: number;

  @Comment('评论内容')
  @Column(DataType.TEXT)
  content: string;

  @Comment('图片评论')
  @Column
  images: string;

  @AllowNull(false)
  @Comment('评论时间')
  @Default(new Date())
  @Column
  commentTime: Date;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('发布评论账号ID')
  @Column
  commentAccountId: number;

  @BelongsTo(() => AccountUser)
  commentAccount: AccountUser;

  // 发布评论对应的文章
  @AllowNull(false)
  @ForeignKey(() => Posts)
  @Comment('发布评论对应的ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @AllowNull(false)
  @Comment('评论状态 1 正常状态 2被下架状态')
  @Default(1)
  @Column
  status: number;

  @HasMany(() => PostCommentsReply)
  replys: PostCommentsReply[];
}
