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

// 投放推广
@Table({
  modelName: 'publicize',
  timestamps: true,
})
export class Publicize extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  publicizeId: number;

  @AllowNull(false)
  @Comment('推广投放标题')
  @Column
  title: string;

  @AllowNull(false)
  @Comment('图片链接')
  @Column
  imgUrl: string;

  @Comment('推广说明')
  @Column
  desc: string;

  @AllowNull(false)
  @Comment(
    '推广类型 1首页轮播图 2首页右侧推广 3文章中插推广 4尺牍横条推广 5同人工坊推广 ',
  )
  @Column
  type: number;

  @AllowNull(false)
  @Comment('是否跳转链接')
  @Default(true)
  @Column
  jumpLink: boolean;

  @Comment('跳转链接')
  @Column
  url: string;

  @AllowNull(false)
  @Comment('是否为外链')
  @Default(false)
  @Column
  out: boolean;

  @AllowNull(false)
  @Comment('排序')
  @Default(99)
  @Column
  sort: number;

  @Comment('展示状态')
  @Column
  state: number;

  @Comment('开始时间 占位')
  @Column
  startTime: string;

  @Comment('结束时间 占位')
  @Column
  endTime: string;
}
