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
} from 'sequelize-typescript';
import { ExpFireTypes, AccountUser } from '../index.model';

// 账号
@Table({
  modelName: 'exp_record',
  timestamps: true,
})
export class ExpRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @Comment('经验值')
  @Column
  exp: number;

  @Comment('增加 add 或 减少 lower')
  @Column
  addType: 'add' | 'lower';

  @AllowNull(false)
  @ForeignKey(() => ExpFireTypes)
  @Comment('绑定类型')
  @Column
  typeId: number;

  @BelongsTo(() => ExpFireTypes)
  type: ExpFireTypes;

  @ForeignKey(() => AccountUser)
  @Comment('绑定AccountId')
  @Column
  bindUserId: number;

  @BelongsTo(() => AccountUser)
  bindUser: AccountUser;
}
