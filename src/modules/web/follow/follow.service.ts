import { HttpException, Injectable } from '@nestjs/common';
import { AccountUser, FollowRecord } from '../../../models/index.model';
import { FollowFormDto } from './dto_vo/follow.dto';

@Injectable()
export class FollowService {
  async actionFollow(followForm: FollowFormDto, userId: number) {
    const { followId } = followForm;
    const findUser = await AccountUser.findByPk(followId);
    if (!findUser) {
      throw new HttpException('被关注者账号不存在或异常', 400);
    }
    const findFollowRecord = await FollowRecord.findOne({
      where: {
        followUserId: userId,
      },
    });

    if (!findFollowRecord) {
      await FollowRecord.create({
        status: true,
        followerId: followId,
        followUserId: userId,
      });
      return true;
    } else {
      const followStatus = findFollowRecord.getDataValue('status');
      findFollowRecord.status = !followStatus;
      findFollowRecord.save();

      return !followStatus;
    }
  }
}
