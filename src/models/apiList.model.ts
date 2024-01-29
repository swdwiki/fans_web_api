// import {
//   Column,
//   Model,
//   Table,
//   PrimaryKey,
//   AutoIncrement,
//   AllowNull,
//   Comment,
// } from 'sequelize-typescript';

// // 账号
// @Table({
//   modelName: 'api_list',
//   timestamps: true,
// })
// export class ApiList extends Model {
//   @AutoIncrement
//   @PrimaryKey
//   @Column
//   apiId: number;

//   @AllowNull(false)
//   @Comment('API借口')
//   @Column
//   api: string;

//   @AllowNull(false)
//   @Comment('API借口')
//   @Column
//   name: string;

//   @AllowNull(false)
//   @Comment('admin 管理端 client 客户端 all 通用')
//   @Column
//   type: string;

//   @AllowNull(false)
//   @Comment('admin 管理端 client 客户端 all 通用')
//   @Column
//   version: string;

//   @AllowNull(false)
//   @Comment('admin 管理端 client 客户端 all 通用')
//   @Column
//   version: string;

//   @AllowNull(false)
//   @Comment('admin 管理端 client 客户端 all 通用')
//   @Column
//   menuId: number;
// }
