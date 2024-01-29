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

// 账号
@Table({
  modelName: 'web_setting',
  timestamps: true,
})
export class WebSetting extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  _id: number;

  @AllowNull(false)
  @Default(false)
  @Comment('是否开启测试邀请码准入限制')
  @Column
  testInvit: boolean;

  @AllowNull(false)
  @Default(false)
  @Comment('是否开启内容AI审核')
  @Column
  examineBy: boolean;
}
