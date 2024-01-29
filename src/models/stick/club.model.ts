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
import { StickThemes } from '../index.model';

// 帖子标题
@Table({
  modelName: 'stick_clubs',
  timestamps: true,
})
export class StickClubs extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  clubId: number;

  @AllowNull(false)
  @Comment('圈子名称')
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

  @HasMany(() => StickThemes)
  themes: StickThemes[];
}
