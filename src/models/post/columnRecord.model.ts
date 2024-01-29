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
import { Posts, PostColumns } from '../index.model';

// 专栏文章记录
@Table({
  modelName: 'post_column_record',
  timestamps: true,
})
export class PostColumnRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @ForeignKey(() => Posts)
  @Comment('所属专题ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @ForeignKey(() => PostColumns)
  @Comment('所属专栏ID')
  @Column
  columnId: number;

  @BelongsTo(() => PostColumns)
  column: PostColumns;
}
