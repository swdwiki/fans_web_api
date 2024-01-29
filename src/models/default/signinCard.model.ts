// 签到记录
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
  DataType,
  Default,
} from 'sequelize-typescript';
import { AccountUser } from '../index.model';

// 账号
@Table({
  modelName: 'signin_card',
  timestamps: true,
})
export class SigninCard extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  cardId: number;

  @Comment('补签签到日 格式 YYYY-MM-DD')
  @Column(DataType.STRING)
  signinTime: string;

  @Comment('来源')
  @Column(DataType.TEXT)
  mark: string;

  @Comment('使用时间')
  @Default(() => {
    return new Date();
  })
  @Column
  supplyTime: Date;

  @AllowNull(false)
  @Comment('使用状态')
  @Default(false)
  @Column
  status: boolean;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('持有者Id')
  @Column
  ownerId: number;

  @BelongsTo(() => AccountUser)
  owner: AccountUser;
}
