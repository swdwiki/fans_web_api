import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  ForeignKey,
  HasMany,
  HasOne,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { Posts, PostPlate } from '../index.model';

// 帖子标题
@Table({
  modelName: 'post_plate_record',
  timestamps: true,
})
export class PostPlateRecord extends Model {
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

  @ForeignKey(() => PostPlate)
  @Comment('所属标签ID')
  @Column
  plateId: number;

  @BelongsTo(() => PostPlate)
  plate: PostPlate;

  @AllowNull(false)
  @Comment('所属专题ID')
  @Default(true)
  @Column
  state: boolean;
}
