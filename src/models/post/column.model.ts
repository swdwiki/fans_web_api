import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Comment,
  BelongsTo,
  ForeignKey,
  Default,
  AllowNull,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { AccountUser, PostColumnRecord, Posts } from '../index.model';

// 帖子专题
@Table({
  modelName: 'post_columns',
  timestamps: true,
})
export class PostColumns extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  columnId: number;

  @AllowNull(false)
  @Comment('标题')
  @Column
  name: string;

  @Comment('封面图')
  @Column
  cover: string;

  @Comment('当前状态 已通过 published 审核中 auditing   未通过 injected')
  @Default('auditing')
  @Column
  status: 'published' | 'auditing' | 'injected';

  @Comment('专栏介绍')
  @Column(DataType.TEXT)
  desc: string;

  @ForeignKey(() => AccountUser)
  @Comment('所有者')
  @Column
  ownerId: number;

  @BelongsTo(() => AccountUser)
  user: AccountUser;

  @BelongsToMany(() => Posts, () => PostColumnRecord)
  posts: Posts[];
}
