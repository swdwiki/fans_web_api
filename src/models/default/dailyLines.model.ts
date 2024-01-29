import * as dayjs from 'dayjs';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  DataType,
  Default,
} from 'sequelize-typescript';

// 账号
@Table({
  modelName: 'daily_lines',
  timestamps: true,
})
export class DailyLines extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @Comment('内容')
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @Comment('内容来源')
  @Column(DataType.TEXT)
  linesFrom: string;

  @AllowNull(false)
  @Comment('是否为纪念日')
  @Default(false)
  @Column
  isAnniversary: boolean;

  @Comment('纪念日说明')
  @Column
  anniversary: string;

  @AllowNull(false)
  @Comment('封面图片')
  @Column
  cover: string;

  @AllowNull(false)
  @Comment('日期')
  @Column
  date: string;
}
