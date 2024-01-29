import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
} from 'sequelize-typescript';

// 帖子专题
@Table({
  modelName: 'weblinks',
  timestamps: true,
})
export class WebLinks extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  linkId: number;

  @AllowNull(false)
  @Comment('链接类型 1首页官方链接列表 2友情链接 3待定')
  @Column
  type: number;

  @AllowNull(false)
  @Comment('链接标题')
  @Column
  title: number;

  @Comment('图标地址')
  @Column
  avatar: string;

  @AllowNull(false)
  @Comment('跳转链接地址')
  @Column
  url: string;

  @AllowNull(false)
  @Comment('排序')
  @Default(99)
  @Column
  sort: number;

  @Comment('链接说明')
  @Column
  desc: string;

  @Comment('展示状态')
  @Column
  state: number;
}
