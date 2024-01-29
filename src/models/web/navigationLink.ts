// import {
//     Column,
//     Model,
//     Table,
//     PrimaryKey,
//     AutoIncrement,
//     AllowNull,
//     Comment,
//     Default,
//   } from 'sequelize-typescript';

//   // 帖子专题
//   @Table({
//     modelName: 'posts',
//     timestamps: true,
//   })
//   export class Publicize extends Model {
//     @AutoIncrement
//     @PrimaryKey
//     @Column
//     linkId: number;

//     @AllowNull(false)
//     @Comment('图片链接')
//     @Column
//     imgUrl: string;

//     @AllowNull(false)
//     @Comment(
//       '链接类型 1首页官方链接列表 2友情链接 3待定',
//     )
//     @Column
//     type: number;

//     @AllowNull(false)
//     @Comment('是否跳转链接')
//     @Default(true)
//     @Column
//     jumpLink: boolean;

//     @Comment('跳转链接')
//     @Column
//     url: string;

//     @AllowNull(false)
//     @Comment('是否为外链')
//     @Default(false)
//     @Column
//     out: boolean;

//     @AllowNull(false)
//     @Comment('排序')
//     @Default(99)
//     @Column
//     sort: number;

//     @Comment('推广说明')
//     @Column
//     desc: string;

//     @Comment('展示状态')
//     @Column
//     state: number;

//     @Comment('开始时间 占位')
//     @Column
//     startTime: string;

//     @Comment('结束时间 占位')
//     @Column
//     endTime: string;
//   }
