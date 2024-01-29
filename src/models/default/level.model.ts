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
import { AccountUser } from '../index.model';

// 关注记录
@Table({
  modelName: 'level',
  timestamps: true,
})
export class Levels extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  levelId: number;

  @AllowNull(false)
  @Comment('等级级别数字')
  @Column
  level: number;

  @AllowNull(false)
  @Comment('最低经验')
  @Column
  minExp: number;

  @AllowNull(false)
  @Comment('最高经验')
  @Column
  maxExp: number;

  @AllowNull(false)
  @Comment('等级别名')
  @Column
  content: string;
}
