// import {
//   Column,
//   Model,
//   Table,
//   AllowNull,
//   Comment,
//   PrimaryKey,
//   AutoIncrement,
//   Default,
// } from 'sequelize-typescript';
// import { User } from './index.model';
// import { v4 as uuidv4 } from 'uuid';

// // 奖品铺中的奖品
// @Table({
//   modelName: 'award',
//   timestamps: true,
// })
// export class Award extends Model {
//   @AutoIncrement
//   @PrimaryKey
//   @Column
//   _id: number;

//   @AllowNull(false)
//   @Comment('奖品ID')
//   @Default(() => {
//     const uuid = uuidv4();
//     return uuid.toString();
//   })
//   @Column
//   awardId: string;

//   @AllowNull(false)
//   @Comment('奖品名称')
//   @Column
//   name: string;

//   @AllowNull(false)
//   @Comment('奖品说明')
//   @Column
//   desc: string;

//   @AllowNull(false)
//   @Comment('奖品数量')
//   @Column
//   count: number;

//   @AllowNull(false)
//   @Comment('兑换所需积分')
//   @Column
//   cost: number;

//   @AllowNull(false)
//   @Comment('封面图片')
//   @Column
//   image: string;

//   @AllowNull(false)
//   @Default(0)
//   @Comment('兑换开始日期')
//   @Column
//   redeemStartTime: number;

//   @AllowNull(false)
//   @Default(0)
//   @Comment('兑换截止日期')
//   @Column
//   redeemEndTime: number;

//   @AllowNull(false)
//   @Default(0)
//   @Comment('是否为实物')
//   @Default(false)
//   @Column
//   reality: boolean;
// }
