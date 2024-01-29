import { Injectable } from '@nestjs/common';
import { LoginLog } from '../../../models/index.model';

@Injectable()
export class LoginLogService {
  async create(accountId) {
    return await LoginLog.create({
      loginType: 'web',
      accountId,
    });
  }

  async list(loginLogQuery) {
    const { current, pageSize, accountId } = loginLogQuery;

    const { count, rows } = await LoginLog.findAndCountAll({
      where: {
        accountId,
      },
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['createdAt', 'DESC']],
    });

    return {
      list: rows,
      total: count,
    };
  }
}
