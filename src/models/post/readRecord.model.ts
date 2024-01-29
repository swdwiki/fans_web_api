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
  modelName: 'post_read_record',
  timestamps: true,
})
export class PostReadRecord extends Model {
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

  @ForeignKey(() => AccountUser)
  @Comment('登录账号登记ID')
  @Column
  readerId: number;

  @BelongsTo(() => AccountUser)
  reader: AccountUser;

  @AllowNull(false)
  @Comment('阅读时间')
  @Default(() => {
    return new Date().valueOf();
  })
  @Column
  readTime: string;

  @Comment('ip地址获取')
  @Column
  ipAddress: string;
}
