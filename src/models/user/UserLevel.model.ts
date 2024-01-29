// import {
//     Column,
//     Model,
//     Table,
//     PrimaryKey,
//     AutoIncrement,
//     AllowNull,
//     Comment,
//     ForeignKey,
//     BelongsTo,
//     Default,
//   } from 'sequelize-typescript';
//   import { Account } from './index.model';

//   // 用户信息
//   @Table({
//     modelName: 'user',
//     timestamps: true,
//   })
//   export class AccountUser extends Model {
//     @AutoIncrement
//     @PrimaryKey
//     @Column
//     userId: number;

//     // @AllowNull(false)
//     @Column
//     uuid: string;

//     @AllowNull(false)
//     @Comment('昵称')
//     @Column
//     nickname: string;

//     // @AllowNull(false)
//     @Comment('头像')
//     // @default('')
//     @Column
//     avatar: string;

//     @Comment('自我介绍')
//     @Column
//     desc: string;

//     @ForeignKey(() => Account)
//     @Comment('绑定AccountId')
//     @Column
//     accountId: number;

//     @BelongsTo(() => Account)
//     account: Account;
//   }
