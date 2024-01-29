import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  BelongsTo,
  //   ForeignKey,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Posts } from '../index.model';

// 帖子专题
@Table({
  modelName: 'post_history',
  timestamps: true,
})
export class PostHistory extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  historyId: number;

  // @AllowNull(false)
  @Comment(
    '文章状态 0 草稿状态 1提交&未审核 2提交&审核通过未发布 3提交&审核通过已发布 4提交&审核未通过',
  )
  @Default(0)
  @Column
  state: number;

  @AllowNull(false)
  @Comment('是否为最新版')
  @Default(false)
  @Column
  mainVersion: boolean;

  @AllowNull(false)
  @Comment('版本文章内容')
  @Column(DataType.TEXT)
  content: string;

  @Comment('版本发布时间')
  @Column
  submitTime: Date;

  @Comment('审核时间')
  @Column
  verifyTime: Date;

  @AllowNull(false)
  @Comment('版本提交时间')
  @Default(() => {
    return new Date();
  })
  @Column
  setTime: Date;

  @AllowNull(false)
  @ForeignKey(() => Posts)
  @Comment('文章ID')
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @Comment('内容文本类型 rich 富文本 markdown md格式')
  @Default('markdown')
  @Column
  editorType: 'markdown' | 'rich';

  @Comment('markdown配置')
  @Column(DataType.TEXT)
  set markdownConfig(value: object) {
    if (value) {
      this.setDataValue('markdownConfig', JSON.stringify(value));
    }
  }
  get markdownConfig(): object {
    if (this.getDataValue('markdownConfig')) {
      return JSON.parse(this.getDataValue('markdownConfig'));
    }
  }
}
