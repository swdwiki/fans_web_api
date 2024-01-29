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
  HasMany,
} from 'sequelize-typescript';
import { AccountUser, Sticks, StickCommentsReply } from '../index.model';

// 帖子评论
@Table({
  modelName: 'stick_comment',
  timestamps: true,
})
export class StickComments extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  commentId: number;

  @Comment('评论内容')
  @Column(DataType.TEXT)
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
  @ForeignKey(() => Sticks)
  @Comment('发布评论对应的ID')
  @Column
  stickId: number;

  @BelongsTo(() => Sticks)
  stick: Sticks;

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

  @HasMany(() => StickCommentsReply)
  replys: StickCommentsReply[];
}
