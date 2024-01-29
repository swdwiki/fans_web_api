import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { PostPlate } from './PostPlates.model';

// 帖子专题
@Table({
  modelName: 'post_subject',
  timestamps: true,
})
export class PostSubject extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  subjectId: number;

  @AllowNull(false)
  @Comment('标题')
  @Column
  title: string;

  @AllowNull(false)
  @Comment('状态 1开启 2关闭')
  @Default(1)
  @Column
  state: number;

  @Comment('简介')
  @Column
  desc: string;

  @AllowNull(false)
  @Comment('排序，默认99，数字越小排前面')
  @Default(99)
  @Column
  sort: number;

  @HasMany(() => PostPlate)
  plates: PostPlate[];
}
