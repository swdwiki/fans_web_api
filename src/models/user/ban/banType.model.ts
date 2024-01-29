import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  DataType,
} from 'sequelize-typescript';

// 封禁原因
@Table({
  modelName: 'ban_types',
  timestamps: true,
})
export class BanTypes extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  banTypeId: number;

  @AllowNull(false)
  @Comment('封禁原因名（简短说明）')
  @Column
  name: string;

  @Comment('原因详细说明')
  @Column(DataType.TEXT)
  reason: boolean;

  @AllowNull(false)
  @Comment('建议封禁天数 0为永久 大于0是具体封禁天数')
  @Column
  banDay: number;
}
