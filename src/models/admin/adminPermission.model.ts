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
//   import { Account } from '../index.model';

// 用户信息
@Table({
  modelName: 'admin_permission',
  timestamps: true,
})
export class AdminPermission extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  permissionId: number;

  @AllowNull(false)
  @Comment('权限代码')
  @Column
  code: string;

  @Comment('权限描述')
  @Column(DataType.TEXT)
  desc: string;
}
