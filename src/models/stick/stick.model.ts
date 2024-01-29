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
  StickComments,
} from '../index.model';

function createRandomNum(min, max) {
  return Math.floor(Math.random() * (min - max) + max);
}

// 帖子标题
@Table({
  modelName: 'sticks',
  timestamps: true,
})
export class Sticks extends Model {
  @AutoIncrement
  @PrimaryKey
  @Validate({ min: 10000 })
  @Column
  stickId: number;

  @AllowNull(false)
  @Comment('尺牍唯一编码')
  @Default(() => {
    const timestamp = new Date().valueOf();
    const randomNum = createRandomNum(1000000, 9999999);
    return String(timestamp) + String(randomNum);
  })
  @Column
  shareId: string;

  @AllowNull(false)
  @Comment('内容')
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @Comment('状态 1审核中 2发布 3下架 4未通过 5软删除一级（隐藏）')
  @Default(2)
  @Column
  status: number;

  @AllowNull(false)
  @Comment('推荐')
  @Default(false)
  @Column
  recommend: boolean;

  @AllowNull(false)
  @Comment('不能删除但是不能提升曝光率')
  @Default(false)
  @Column
  blackBoard: boolean;

  @ForeignKey(() => StickThemes)
  @Comment('所属主题ID')
  @Column
  themeId: number;

  @BelongsTo(() => StickThemes)
  theme: StickThemes;

  @AllowNull(false)
  @ForeignKey(() => AccountUser)
  @Comment('作者ID')
  @Column
  authorId: number;

  @BelongsTo(() => AccountUser)
  author: AccountUser;

  @Comment('图片列表')
  @Column(DataType.TEXT)
  get imgList(): Array<any> {
    if (this.getDataValue('imgList')) {
      return JSON.parse(this.getDataValue('imgList'));
    } else {
      return [];
    }
  }

  set imgList(value: Array<any>) {
    if (value && value.length !== 0) {
      this.setDataValue('imgList', JSON.stringify(value));
    } else {
      this.setDataValue('imgList', null);
    }
  }

  @Comment('链接信息')
  @Column(DataType.TEXT)
  link: string;

  @AllowNull(false)
  @Comment('发布时间')
  @Default(() => {
    return new Date();
  })
  @Column(DataType.DATE)
  submitTime: Date;

  @HasMany(() => StickLikeRecord)
  likes: StickLikeRecord[];

  @HasMany(() => StickComments)
  comments: StickComments[];
}
