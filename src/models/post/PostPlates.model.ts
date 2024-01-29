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
import { PostSubject, PostPlateRecord, Posts } from '../index.model';

// 帖子标题
@Table({
  modelName: 'post_plates',
  timestamps: true,
})
export class PostPlate extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  plateId: number;

  @AllowNull(false)
  @Comment('板块名称')
  @Column
  name: string;

  @AllowNull(false)
  @Comment('状态 1启用 2禁用')
  @Column
  state: number;

  @AllowNull(false)
  @Comment('排序，默认99，数字越小排前面')
  @Default(99)
  @Column
  sort: number;

  @AllowNull(false)
  @Comment('仅管理员可用')
  @Default(false)
  @Column
  isAdmin: boolean;

  @Comment('简介')
  @Column
  desc: string;

  @ForeignKey(() => PostSubject)
  @Comment('所属专题ID')
  @Column
  subjectId: number;

  @BelongsTo(() => PostSubject)
  subject: PostSubject;

  @BelongsToMany(() => Posts, () => PostPlateRecord)
  posts: Posts[];
}
