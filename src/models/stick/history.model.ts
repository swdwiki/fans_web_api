import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Comment,
  Default,
  BelongsTo,
  Validate,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import {
  AccountUser,
  StickThemes,
  StickLikeRecord,
  Sticks,
} from '../index.model';

function createRandomNum(min, max) {
  return Math.floor(Math.random() * (min - max) + max);
}

// 帖子标题
@Table({
  modelName: 'sticks_history',
  timestamps: true,
})
export class SticksHistory extends Model {
  @AutoIncrement
  @PrimaryKey
  @Validate({ min: 10000 })
  @Column
  historyId: number;

  @AllowNull(false)
  @Comment('内容')
  @Column
  content: string;

  @Comment('图片列表')
  @Column(DataType.TEXT)
  get imgList(): Array<string> {
    if (this.getDataValue('imgList')) {
      return this.getDataValue('imgList').split(';');
    } else {
      return [];
    }
  }

  set imgList(value: Array<string>) {
    if (value) {
      this.setDataValue('imgList', value.join(';'));
    } else {
      this.setDataValue('imgList', null);
    }
  }

  @Comment('链接信息')
  @Column(DataType.TEXT)
  link: string;

  @AllowNull(false)
  @Comment('发布时间')
  @Default(new Date())
  @Column(DataType.DATE)
  submitTime: Date;

  @BelongsTo(() => Sticks)
  stick: Sticks;
}
