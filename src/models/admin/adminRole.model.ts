import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  ForeignKey,
  BelongsTo,
  Default,
  DataType,
} from 'sequelize-typescript';
import { Account } from '../index.model';

// 用户信息
@Table({
  modelName: 'admin_roles',
  timestamps: true,
})
export class AdminRoles extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  roleId: number;

  @AllowNull(false)
  @Comment('角色名称')
  @Column
  name: string;

  @AllowNull(false)
  @Comment('是否启用')
  @Default(false)
  @Column
  state: boolean;

  @Comment('角色说明')
  @Column(DataType.TEXT)
  desc: string;
}
