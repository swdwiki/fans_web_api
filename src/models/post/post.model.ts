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
  HasMany,
  DataType,
} from 'sequelize-typescript';
import {
  PostSubject,
  AccountUser,
  PostPlate,
  PostPlateRecord,
  PostHistory,
  Tags,
  PostTagRecord,
  PostColumns,
  PostColumnRecord,
} from '../index.model';

// 帖子专题
@Table({
  modelName: 'posts',
  timestamps: true,
})
export class Posts extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  postId: number;

  @AllowNull(false)
  @Comment('标题')
  @Column
  title: string;

  @Comment('封面图')
  @Column
  cover: string;

  @Comment('文章简介')
  @Column
  desc: string;

  @AllowNull(false)
  @Comment('是否置顶')
  @Default(false)
  @Column
  top: boolean;

  @AllowNull(false)
  @Comment('是否置顶')
  @Default(false)
  @Column
  subjectTop: boolean;

  @AllowNull(false)
  @Comment('是否置顶')
  @Default(false)
  @Column
  plateTop: boolean;

  @AllowNull(false)
  @Comment('是否加精')
  @Default(false)
  @Column
  fine: boolean;

  @AllowNull(false)
  @ForeignKey(() => PostSubject)
  @Comment('专题ID')
  @Column
  subjectId: number;

  @BelongsTo(() => PostSubject)
  subject: PostSubject;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('作者Id')
  @Column
  authorId: number;

  @BelongsTo(() => AccountUser)
  author: AccountUser;

  @HasMany(() => PostHistory)
  history: PostHistory[];

  @BelongsToMany(() => PostColumns, () => PostColumnRecord)
  columns: PostColumns[];

  // @ForeignKey(() => Activity)
  // @Comment('活动')
  // @Column
  // activityId: number;

  // @BelongsTo(() => Activity)
  // activity: Activity;

  @BelongsToMany(() => PostPlate, () => PostPlateRecord)
  plates: PostPlate[];

  @BelongsToMany(() => Tags, () => PostTagRecord)
  tags: Tags[];

  @Comment('标签列表')
  @Column(DataType.TEXT)
  get tagList(): Array<string> {
    if (this.getDataValue('tagList')) {
      return this.getDataValue('tagList').split(';');
    }
  }

  set tagList(value: Array<string>) {
    this.setDataValue('tagList', value.join(';'));
  }

  @AllowNull(false)
  @Comment(
    '文章状态 0 草稿状态 1提交&未审核 2提交&审核通过未发布 3提交&审核通过已发布 4提交&审核未通过',
  )
  @Default(0)
  @Column
  state: number;

  @Comment('未通过原因')
  @Column(DataType.TEXT)
  reason: string;
}
