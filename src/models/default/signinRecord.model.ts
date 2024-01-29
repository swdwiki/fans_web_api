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
import * as dayjs from 'dayjs';

// 账号
@Table({
  modelName: 'signin_record',
  timestamps: true,
})
export class SigninRecord extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  recordId: number;

  @AllowNull(false)
  @Comment('签到日时间戳')
  @Default(() => {
    return String(
      new Date(dayjs(new Date()).format('YYYY-MM-DD')).valueOf() / 1000,
    );
  })
  @Column(DataType.STRING)
  set signinTimestamp(value: Date) {
    this.setDataValue(
      'signinTimestamp',
      String(new Date(value).valueOf() / 1000),
    );
  }

  get signinTimestamp(): Date {
    return new Date(Number(this.getDataValue('signinTimestamp')) * 1000);
  }

  @AllowNull(false)
  @Comment('签到日 格式 YYYY-MM-DD')
  @Column(DataType.STRING)
  signinTime: string;

  @AllowNull(false)
  @Comment('签到时间')
  @Default(() => {
    return new Date();
  })
  @Column
  submitSigninTime: Date;

  @AllowNull(false)
  @Comment('签到状态')
  @Default(true)
  @Column
  status: boolean;

  @AllowNull(false)
  @Comment('是否为补签')
  @Default(false)
  @Column
  supSign: boolean;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('签到账号')
  @Column
  signinUserId: number;

  @BelongsTo(() => AccountUser)
  signinUser: AccountUser;
}
