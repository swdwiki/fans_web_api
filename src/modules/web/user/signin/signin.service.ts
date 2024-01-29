import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import {
  ExpRecord,
  ExpFireTypes,
  FireRecord,
  SigninCard,
  SigninRecord,
  DailyLines,
} from '../../../../models/index.model';
import * as dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ExpService } from '../../exp/exp.service';

dayjs.extend(weekday);

@Injectable()
export class SigninService {
  constructor(private sequelize: Sequelize, private expService: ExpService) {}
  getMonth = (e: any) => {
    const startDay = dayjs(e).startOf('month');
    const endDay = dayjs(e).endOf('month');
    // dayjs(e)
    console.log(startDay.format('YYYY-MM-DD'), endDay.format('YYYY-MM-DD'));
    const list = [];

    let currentDay = startDay;
    while (currentDay.isBefore(endDay)) {
      list.push({
        day: currentDay,
        week: currentDay.weekday(),
        date: currentDay.format('YYYY-MM-DD'),
        isShow: true,
      });
      currentDay = currentDay.add(1, 'day');
    }

    // // 上个月补充
    let week = list[0].day.day();
    if (week === 0) {
      week = 7;
    }
    for (let i = 1; i < week; i += 1) {
      // ishow:区分是否是本月日期
      const day = startDay.add(-i, 'day');
      list.unshift({
        day,
        week: day.weekday(),
        date: day.format('YYYY-MM-DD'),
        isShow: false,
      });
    }

    // // 下个月补充   42:日历中的六周 * 一周七天
    // const nextWeek = 42 - (dayjs(e).daysInMonth() + week - 1);
    // for (let i = 1; i <= nextWeek; i += 1) {
    //   // ishow:区分是否是本月日期
    //   list.push({ day: endDay.add(i, 'day'), isMonth: false });
    // }

    // list.forEach((item: any) => {
    //   const str = item.day.$d.toLocaleDateString().replaceAll('/', '-');
    //   item.time = dayjs(str).format('YYYY-MM-DD');
    // });
    // console.log('本月天数', list);
    return list;
  };

  async signin(signinForm, userId) {
    const { signinTime } = signinForm;
    if (new Date(signinTime).toString() === 'Invalid Date') {
      throw new HttpException('签到时间格式错误', 403);
    }
    if (signinTime > dayjs().format('YYYY-MM-DD')) {
      throw new HttpException('未到签到时间，请勿提前签到', 403);
    }
    if (signinTime < dayjs().format('YYYY-MM-DD')) {
      throw new HttpException('签到时间已过期，如需签到请使用补签功能', 403);
    }
    const findSigninRecord = await SigninRecord.findOne({
      where: {
        signinTime,
        status: true,
        signinUserId: userId,
      },
    });
    if (findSigninRecord) {
      throw new HttpException('你今日已签到过了', 200);
    }
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const record = await SigninRecord.create(
          {
            ...signinForm,
            signinUserId: userId,
          },
          {
            transaction: t,
          },
        );

        if (record) {
          const actionCount = await this.expService.actionExpAndFire(
            'signin',
            userId,
          );
          return actionCount;
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('服务错误：签到错误，请联系网站管理员', 503);
    }
  }

  async signinBySupply(signinForm, userId) {
    const { signinTime } = signinForm;
    if (new Date(signinTime).toString() === 'Invalid Date') {
      throw new HttpException('签到时间格式错误', 403);
    }

    const findSigninRecord = await SigninRecord.findOne({
      where: {
        signinTime,
        status: true,
        signinUserId: userId,
      },
    });
    if (findSigninRecord) {
      throw new HttpException('你已签到过了', 200);
    }
    // 查找补签卡
    const supCardCount = await SigninCard.count({
      where: {
        status: false,
        ownerId: userId,
      },
    });
    if (supCardCount === 0) {
      throw new ForbiddenException('补签卡数量不足，无法补签');
    }
    if (signinTime > dayjs().format('YYYY-MM-DD')) {
      throw new HttpException('未到签到时间，请勿提前签到', 403);
    }
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const record = await SigninRecord.create(
          {
            ...signinForm,
            signinUserId: userId,
            supSign: true,
          },
          {
            transaction: t,
          },
        );

        if (record) {
          const actionCount = await this.expService.actionExpAndFire(
            'sup_signin',
            userId,
          );
          const supCard = await SigninCard.findOne({
            where: {
              status: false,
              ownerId: userId,
            },
            transaction: t,
          });

          const updateCard = await SigninCard.update(
            {
              status: true,
            },
            {
              where: {
                status: false,
                ownerId: userId,
                cardId: supCard.getDataValue('cardId'),
              },
              transaction: t,
            },
          );
          // supCard.status = true;
          // supCard.save();

          return actionCount && updateCard[0] > 0;
        }
        return result;
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('服务错误：注册错误，请联系网站管理员', 503);
    }
  }

  async signinRecordByMonth(month: string, userId: number) {
    const monthlist = this.getMonth(month);
    const now = dayjs().format('YYYY-MM-DD');
    const findTodaySignRecord = await SigninRecord.findOne({
      where: {
        signinTime: now,
        status: true,
        signinUserId: userId,
      },
    });

    for (const index in monthlist) {
      if (monthlist[index].isShow) {
        const info = await SigninRecord.findOne({
          where: {
            signinTime: monthlist[index].date,
            status: true,
            signinUserId: userId,
          },
        });
        if (info) {
          monthlist[index].record = {
            date: monthlist[index].date,
            data: info,
            sign: true,
          };
        } else {
          monthlist[index].record = {
            date: monthlist[index].date,
            sign: false,
          };
        }
      } else {
        monthlist[index].record = null;
      }
    }

    // const dailyLine = await DailyLines.findOne({
    //   where:{
    //     date:
    //   }
    // })

    // console.log(ChineseWorkday.getFestival('2022-10-01'));

    return {
      monthlist,
      todaySign: findTodaySignRecord ? true : false,
      // dailyLine:
    };
  }

  // async actionExpAndFire(key: string, userId: number) {
  //   const todayStart = new Date(dayjs().format('YYYY-MM-DD 00:00:00'));
  //   const todayEnd = new Date(dayjs().format('YYYY-MM-DD 23:59:59'));
  //   const actionType = await ExpFireTypes.findOne({
  //     where: {
  //       key,
  //     },
  //   });

  //   const expTypeCount = await ExpRecord.count({
  //     where: {
  //       bindUserId: userId,
  //       addType: actionType.getDataValue('addType'),
  //       typeId: actionType.getDataValue('typeId'),
  //       createdAt: {
  //         [Op.lte]: todayEnd,
  //         [Op.gte]: todayStart,
  //       },
  //     },
  //   });
  //   const fireTypeCount = await FireRecord.count({
  //     where: {
  //       bindUserId: userId,
  //       addType: actionType.getDataValue('addType'),
  //       typeId: actionType.getDataValue('typeId'),
  //       createdAt: {
  //         [Op.lte]: todayEnd,
  //         [Op.gte]: todayStart,
  //       },
  //     },
  //   });

  //   // 经验操作
  //   try {
  //     const result = await this.sequelize.transaction(async (t) => {
  //       const action = {
  //         exp: undefined,
  //         fire: undefined,
  //       };
  //       if (
  //         expTypeCount < actionType.getDataValue('dailyTimer') ||
  //         !actionType.getDataValue('dailyTimer')
  //       ) {
  //         action.exp = await ExpRecord.create(
  //           {
  //             exp: actionType.getDataValue('exp'),
  //             addType: actionType.getDataValue('addType'),
  //             typeId: actionType.getDataValue('typeId'),
  //             bindUserId: userId,
  //           },
  //           {
  //             transaction: t,
  //           },
  //         );
  //       } else {
  //         action.exp = true;
  //       }
  //       // 黑火操作
  //       if (
  //         fireTypeCount < actionType.getDataValue('dailyTimer') ||
  //         !actionType.getDataValue('dailyTimer')
  //       ) {
  //         action.fire = await FireRecord.create(
  //           {
  //             fire: actionType.getDataValue('fire'),
  //             addType: actionType.getDataValue('addType'),
  //             typeId: actionType.getDataValue('typeId'),
  //             bindUserId: userId,
  //           },
  //           {
  //             transaction: t,
  //           },
  //         );
  //       } else {
  //         action.fire = true;
  //       }
  //       console.log(action, 'action');
  //       return action.fire && action.exp;
  //     });
  //     console.log(result, 'exp');
  //     return result;
  //   } catch (err) {
  //     throw new HttpException('服务器错误，请联系管理员', 500);
  //   }
  // }
}
