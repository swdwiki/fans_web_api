import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import {
  AccountUser,
  Posts,
  StickComments,
  StickCommentsReply,
  Sticks,
} from '../index.model';

// 账号
@Table({
  modelName: 'reports',
  timestamps: true,
})
export class Reports extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  reportId: number;

  @AllowNull(false)
  @Comment('举报类型')
  @Column
  reasonId: number;

  @AllowNull(false)
  @Comment('举报内容类型')
  @Column
  type: string;

  @AllowNull(false)
  @Comment('举报内容')
  @Column(DataType.TEXT)
  content: string;

  @Comment('管理员回复')
  @Column(DataType.TEXT)
  adminReply: string;

  @AllowNull(false)
  @Comment('管理员处理状态 0 待处理 1投诉有效已处理 2 投诉无效驳回')
  @Default(0)
  @Column
  replyStatus: number;

  @AllowNull(false)
  @Comment('管理员阅读状态')
  @Default(false)
  @Column
  adminReadStatus: boolean;

  @Comment('图片附件')
  @Column(DataType.TEXT)
  get imgFilesUrl(): Array<string> {
    if (this.getDataValue('imgFilesUrl')) {
      return JSON.parse(this.getDataValue('imgFilesUrl'));
    } else {
      return [];
    }
  }

  set imgFilesUrl(value: Array<string>) {
    if (value) {
      this.setDataValue('imgFilesUrl', JSON.stringify(value));
    } else {
      this.setDataValue('imgFilesUrl', null);
    }
  }

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('举报者ID')
  @Column
  userId: number;

  @BelongsTo(() => AccountUser)
  user: AccountUser;

  @ForeignKey(() => Posts)
  @Comment('举报文章ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @ForeignKey(() => Sticks)
  @Comment('举报尺牍ID')
  @Column
  stickId: number;

  @BelongsTo(() => Sticks)
  stick: Sticks;

  //   尺牍评论
  @ForeignKey(() => StickComments)
  @Comment('举报尺牍评论ID')
  @Column
  stickCommentId: number;

  @BelongsTo(() => StickComments)
  stickComment: StickComments;

  //   尺牍回复
  @ForeignKey(() => StickCommentsReply)
  @Comment('举报尺牍回复ID')
  @Column
  stickCommentReplyId: number;

  @BelongsTo(() => StickCommentsReply)
  stickCommentReply: StickCommentsReply;

  //   //   文章评论
  //   @ForeignKey(() => StickComments)
  //   @Comment('举报尺牍ID')
  //   @Column
  //   postCommentId: number;

  //   @BelongsTo(() => StickComments)
  //   stickComment: StickComments;

  //   @ForeignKey(() => Posts)
  //   @Comment('举报同人作品ID')
  //   @Column
  //   postId: number;

  //   @BelongsTo(() => Posts)
  //   post: Posts;
}
