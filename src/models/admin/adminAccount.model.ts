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
} from 'sequelize-typescript';
import { Account, AdminRoles } from '../index.model';

// 用户信息
@Table({
  modelName: 'admin_user_account',
  timestamps: true,
})
export class AdminUserAccount extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  adminUserId: number;

  @ForeignKey(() => Account)
  @Comment('绑定AccountId')
  @Column
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;

  @ForeignKey(() => AdminRoles)
  @Comment('角色权限ID')
  @Column
  roleId: number;

  @BelongsTo(() => AdminRoles)
  role: AdminRoles;
}
