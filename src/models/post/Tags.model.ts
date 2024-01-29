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
  BelongsToMany,
  Default,
} from 'sequelize-typescript';
import { PostTagRecord, Posts } from '../index.model';

// 帖子标题
@Table({
  modelName: 'tags',
  timestamps: true,
})
export class Tags extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  tagId: number;

  @AllowNull(false)
  @Comment('标签名称')
  @Column
  name: string;

  @AllowNull(false)
  @Comment('状态 1启用 2禁用')
  @Default(1)
  @Column
  state: number;

  @AllowNull(false)
  @Comment('排序，默认99，数字越小排前面')
  @Default(99)
  @Column
  sort: number;

  @Comment('简介')
  @Column
  desc: string;

  // 文章
  @BelongsToMany(() => Posts, () => PostTagRecord)
  posts: Posts[];

  // 同人游戏
  // @BelongsToMany(() => Posts, () => PostTagRecord)
  // posts: Posts[];

  // 动态
  // @BelongsToMany(() => Posts, () => PostTagRecord)
  // posts: Posts[];

  // 同人作品
  // @BelongsToMany(() => Posts, () => PostTagRecord)
  // posts: Posts[];
}
