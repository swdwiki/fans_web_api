import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ExpRecord, FireRecord } from '../index.model';

// 账号
@Table({
  modelName: 'exp_fire_type',
  timestamps: true,
})
export class ExpFireTypes extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  typeId: number;

  @Comment('增加 add 或 减少 lower')
  @Column
  addType: 'add' | 'lower';

  @AllowNull(false)
  @Comment('经验值')
  @Column
  exp: number;

  @AllowNull(false)
  @Comment('黑火值')
  @Column
  fire: number;

  @Comment('每日最多次数')
  @Column
  dailyTimer: number;

  @AllowNull(false)
  @Comment('关键词')
  @Column
  key: string;

  @AllowNull(false)
  @Comment('经验值显示内容')
  @Column
  value: string;

  @Comment('其他说明')
  @Column
  content: string;

  @AllowNull(false)
  @Comment('是否为首次任务')
  @Default(false)
  @Column
  first: boolean;

  @AllowNull(false)
  @Comment('跳转路由')
  @Column
  router: string;

  @Comment('按钮说明')
  @Column
  btnText: string;

  @HasMany(() => FireRecord)
  fireRecord: FireRecord[];

  @HasMany(() => ExpRecord)
  expRecord: ExpRecord[];
}
