import { Injectable, HttpException } from '@nestjs/common';
import {
  ExpFireTypes,
  ExpRecord,
  FireRecord,
} from '../../../models/index.model';
import * as dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class ExpService {
  constructor(private sequelize: Sequelize) {}
  async actionExpAndFire(key: string, userId: number) {
    const todayStart = new Date(dayjs().format('YYYY-MM-DD 00:00:00'));
    const todayEnd = new Date(dayjs().format('YYYY-MM-DD 23:59:59'));
    const actionType = await ExpFireTypes.findOne({
      where: {
        key,
      },
    });

    const expTypeCount = await ExpRecord.count({
      where: {
        bindUserId: userId,
        addType: actionType.getDataValue('addType'),
        typeId: actionType.getDataValue('typeId'),
        createdAt: {
          [Op.lte]: todayEnd,
          [Op.gte]: todayStart,
        },
      },
    });
    const fireTypeCount = await FireRecord.count({
      where: {
        bindUserId: userId,
        addType: actionType.getDataValue('addType'),
        typeId: actionType.getDataValue('typeId'),
        createdAt: {
          [Op.lte]: todayEnd,
          [Op.gte]: todayStart,
        },
      },
    });

    // 经验操作
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const action = {
          exp: undefined,
          fire: undefined,
        };
        if (
          expTypeCount < actionType.getDataValue('dailyTimer') ||
          !actionType.getDataValue('dailyTimer')
        ) {
          action.exp = await ExpRecord.create(
            {
              exp: actionType.getDataValue('exp'),
              addType: actionType.getDataValue('addType'),
              typeId: actionType.getDataValue('typeId'),
              bindUserId: userId,
            },
            {
              transaction: t,
            },
          );
        } else {
          action.exp = true;
        }
        // 黑火操作
        if (
          fireTypeCount < actionType.getDataValue('dailyTimer') ||
          !actionType.getDataValue('dailyTimer')
        ) {
          action.fire = await FireRecord.create(
            {
              fire: actionType.getDataValue('fire'),
              addType: actionType.getDataValue('addType'),
              typeId: actionType.getDataValue('typeId'),
              bindUserId: userId,
            },
            {
              transaction: t,
            },
          );
        } else {
          action.fire = true;
        }
        console.log(action, 'action');
        return action.fire && action.exp;
      });
      console.log(result, 'exp');
      return result;
    } catch (err) {
      throw new HttpException('服务器错误，请联系管理员', 500);
    }
  }
}
