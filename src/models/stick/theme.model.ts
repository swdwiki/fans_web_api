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
  Default,
  DataType,
} from 'sequelize-typescript';
import { StickClubs } from '../index.model';

// 帖子标题
@Table({
  modelName: 'stick_themes',
  timestamps: true,
})
export class StickThemes extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  themeId: number;

  @AllowNull(false)
  @Comment('圈子主题名称')
  @Column
  name: string;

  @AllowNull(false)
  @Comment('圈子主题封面')
  @Column
  cover: string;

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

  @Comment('公告')
  @Column(DataType.TEXT)
  notice: string;

  @AllowNull(false)
  @ForeignKey(() => StickClubs)
  @Comment('所属大圈子ID')
  @Column
  clubId: number;

  @BelongsTo(() => StickClubs)
  club: StickClubs;

  // 关注关联表

  //   @BelongsToMany(() => Sticks, () => StickThemeRecord)
  //   stick: Posts[];
}
