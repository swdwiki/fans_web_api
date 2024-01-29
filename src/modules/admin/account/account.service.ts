import { Injectable } from '@nestjs/common';
import { regInvitCode } from '../../../models/index.model';
import { getCode } from '../../../core/utils/utils';

@Injectable()
export class AccountService {
  async createInvitCode(createForm: { num: number; endTime: string }) {
    const { num, endTime } = createForm;
    const codeList = [];
    for (let index = 0; index < num; index++) {
      codeList.push({
        code: getCode(12),
        endTime: endTime || null,
      });
    }

    return await regInvitCode.bulkCreate(codeList);
  }
}
