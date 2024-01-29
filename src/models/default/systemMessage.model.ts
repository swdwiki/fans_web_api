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
} from 'sequelize-typescript';
import { AccountUser } from '../index.model';

// 帖子评论
@Table({
  modelName: 'system_message',
  timestamps: true,
})
export class SystemMessages extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  messageId: number;

  // @AllowNull(false)
  @Comment('消息内容')
  @Column
  content: string;

  @Comment('图片')
  @Column
  images: string;

  @AllowNull(false)
  @Comment('评论时间')
  @Default(new Date())
  @Column
  messageTime: Date;

  @ForeignKey(() => AccountUser)
  @Comment('接收消息账号ID')
  @Column
  getMessageAccountId: number;

  @BelongsTo(() => AccountUser)
  getMessageAccount: AccountUser;

  @AllowNull(false)
  @Comment('消息阅读状态')
  @Default(false)
  @Column
  readStatus: boolean;
}
