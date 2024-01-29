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
import { AccountUser } from './index.model';

// 封禁原因
@Table({
  modelName: 'file_list',
  timestamps: true,
})
export class FileList extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  fileId: number;

  @AllowNull(false)
  @Comment('文件原始名称')
  @Column
  name: string;

  @AllowNull(false)
  @Comment('文件完整路径')
  @Column
  filename: string;

  @AllowNull(false)
  @Comment('文件MD5')
  @Column
  fileMd5: string;

  @Comment('上传者类型 user admin')
  @Column
  type: string;

  @Comment('上传者的token')
  @Column
  token: string;

  // 上传userId
  @ForeignKey(() => AccountUser)
  @Comment('上传者的ID')
  @Column
  userId: number;

  @BelongsTo(() => AccountUser)
  user: AccountUser;
}
