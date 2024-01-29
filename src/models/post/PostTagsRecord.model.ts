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
import { Posts, Tags } from '../index.model';

// 帖子标题
@Table({
  modelName: 'post_tag_record',
  timestamps: true,
})
export class PostTagRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @ForeignKey(() => Posts)
  @Comment('所属文章ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @ForeignKey(() => Tags)
  @Comment('所属标签ID')
  @Column
  tagId: number;

  @BelongsTo(() => Tags)
  tags: Tags;

  @AllowNull(false)
  @Comment('连接状态')
  @Default(true)
  @Column
  state: boolean;
}
