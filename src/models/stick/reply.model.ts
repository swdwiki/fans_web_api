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
  DataType,
} from 'sequelize-typescript';
import { AccountUser, StickComments, Sticks } from '../index.model';

// 帖子评论
@Table({
  modelName: 'stick_comment_reply',
  timestamps: true,
})
export class StickCommentsReply extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  replyId: number;

  @Comment('评论内容')
  @Column
  content: string;

  @Comment('图片评论')
  @Column(DataType.TEXT)
  get images(): Array<any> {
    if (this.getDataValue('images')) {
      return JSON.parse(this.getDataValue('images'));
    } else {
      return [];
    }
  }

  set images(value: Array<any>) {
    if (value && value.length !== 0) {
      this.setDataValue('images', JSON.stringify(value));
    } else {
      this.setDataValue('images', null);
    }
  }

  @AllowNull(false)
  @Comment('评论时间')
  @Default(() => {
    return new Date();
  })
  @Column
  commentTime: Date;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('发布回复账号ID')
  @Column
  replyAccountId: number;

  @BelongsTo(() => AccountUser)
  replyAccount: AccountUser;

  @ForeignKey(() => AccountUser)
  @Comment('接收回复的评论账号ID')
  @Column
  receivedAccountId: number;

  @BelongsTo(() => AccountUser)
  receivedAccount: AccountUser;

  // 发布评论对应的尺牍
  @AllowNull(false)
  @ForeignKey(() => Sticks)
  @Comment('发布评论对应的ID')
  @Column
  stickId: number;

  @BelongsTo(() => Sticks)
  stick: Sticks;

  // 发布评论对应的评论ID
  @AllowNull(false)
  @ForeignKey(() => StickComments)
  @Comment('发布评论对应的ID')
  @Column
  commentId: number;

  @BelongsTo(() => StickComments)
  comment: StickComments;

  @AllowNull(false)
  @Comment('评论状态 1 正常状态 2被下架状态')
  @Default(1)
  @Column
  status: number;

  @AllowNull(false)
  @Comment('评论被作者阅读状态')
  @Default(false)
  @Column
  readStatus: boolean;
}
