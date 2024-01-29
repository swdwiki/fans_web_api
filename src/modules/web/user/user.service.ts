import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountUser,
  FollowRecord,
  PostLikeRecord,
  PostPlate,
  PostReadRecord,
  PostSubject,
  Posts,
  SigninRecord,
  StickLikeRecord,
  StickThemes,
  Sticks,
  Levels,
  SigninCard,
  FireRecord,
  ExpFireTypes,
  PostColumns,
  Tags,
  DailyLines,
} from '../../../models/index.model';
import { Sequelize } from 'sequelize-typescript';
import { ExpRecord } from '../../../models/index.model';
import { creatorListQueryDto } from './dto_vo/user.dto';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(private sequelize: Sequelize) {}
  async getPostData(userId) {
    const followerCount = await FollowRecord.count({
      where: {
        followerId: userId,
      },
    });
    const followCount = await FollowRecord.count({
      where: {
        followId: userId,
      },
    });

    const postCount = await Posts.count({
      where: {
        // status:3,
        authorId: userId,
      },
    });

    const readCount = await PostReadRecord.count({
      include: [
        {
          model: Posts,
          as: 'post',
          where: {
            authorId: userId,
          },
        },
      ],
    });

    return {
      readCount,
      postCount,
      followCount,
      followerCount,
    };
  }

  async getCreatorData(userId: number) {
    const fanCount = await FollowRecord.count({
      where: {
        followerId: userId,
        status: true,
      },
    });

    const followCount = await FollowRecord.count({
      where: {
        followUserId: userId,
        status: true,
      },
    });

    const viewCount = await PostReadRecord.count({
      include: [
        {
          model: Posts,
          as: 'post',
          required: true,
          where: {
            authorId: userId,
            state: 3,
          },
        },
      ],
    });

    const postLikeCount = await PostLikeRecord.count({
      where: {
        status: true,
      },
      include: [
        {
          model: Posts,
          as: 'post',
          required: true,
          where: {
            authorId: userId,
            state: 3,
          },
        },
      ],
    });

    const stickLikeCount = await StickLikeRecord.count({
      where: {
        status: true,
      },
      include: [
        {
          model: Sticks,
          as: 'stick',
          required: true,
          where: {
            authorId: userId,
            status: 2,
          },
        },
      ],
    });

    const user = await AccountUser.findOne({
      where: {
        userId,
      },
    });

    const regDay = Math.floor(
      (new Date().valueOf() -
        new Date(user.getDataValue('createdAt')).valueOf()) /
        (1000 * 3600 * 24),
    );

    const signCount = await SigninRecord.count({
      where: {
        signinUserId: userId,
        status: true,
      },
    });

    return {
      fanCount,
      viewCount,
      postLikeCount,
      stickLikeCount,
      workLikeCount: 0,
      workViewCount: 0,
      regDay,
      signCount,
    };

    // const stickLikeCount = await StickLikeRecord.count({
    //   where: {
    //     status: true,
    //   },
    //   include: [
    //     {
    //       model: Sticks,
    //       as: 'stick',
    //       where: {
    //         authorId: userId,
    //       },
    //     },
    //   ],
    // });
  }

  async getCreatorNewSubmitList(userId: number) {
    const stickList = await Sticks.findAll({
      limit: 10,
      offset: 0,
      where: {
        authorId: userId,
        status: 2,
      },
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = sticks.stick_id AND stick_like_record.status=1 AND stick_like_record.deleted_at IS NULL)`,
            ),
            'likeCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_comment WHERE stick_comment.stick_id = sticks.stick_id)`,
            ),
            'commentCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_comment_reply WHERE stick_comment_reply.stick_id = sticks.stick_id)`,
            ),
            'replyCount',
          ],
        ],
      },
      include: [
        {
          model: StickThemes,
          as: 'theme',
        },
        {
          model: AccountUser,
          as: 'author',
        },
      ],
      order: [['createdAt', 'desc']],
    });

    const postList = await Posts.findAll({
      limit: 10,
      offset: 0,
      where: {
        authorId: userId,
        state: 3,
      },
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM post_like_record WHERE post_like_record.post_id = posts.post_id AND post_like_record.status=1 AND post_like_record.deleted_at IS NULL)`,
            ),
            'likeCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = posts.post_id)`,
            ),
            'commentCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM post_comment_reply WHERE post_comment_reply.post_id = posts.post_id)`,
            ),
            'replyCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM post_read_record WHERE post_read_record.post_id = posts.post_id)`,
            ),
            'viewCount',
          ],
        ],
      },
      include: [
        {
          model: PostSubject,
          as: 'subject',
        },
        {
          model: PostPlate,
          as: 'plates',
        },
        {
          model: AccountUser,
          as: 'author',
        },
      ],
      order: [['createdAt', 'desc']],
    });

    const workList = [];

    return {
      stick: stickList,
      post: postList,
      work: workList,
    };
  }

  async getUserCenterIndexData(userId: number, myUserId?: number) {
    const findUser = await AccountUser.findByPk(userId);
    if (!findUser) {
      throw new NotFoundException('未找到用户');
    }
    // 获取关注与粉丝的数据
    const fansCount = await FollowRecord.count({
      where: {
        followerId: userId,
        status: true,
      },
    });
    const followCount = await FollowRecord.count({
      where: {
        followUserId: userId,
        status: true,
      },
    });
    // 获取文章发布数量
    const postCount = await Posts.count({
      where: {
        authorId: userId,
        state: 3,
      },
    });

    // 获取尺牍发布数量
    const stickCount = await Sticks.count({
      where: {
        authorId: userId,
        status: 2,
      },
    });
    // 获取文章总点赞数量
    const postLikeCount = await PostLikeRecord.count({
      where: {
        status: true,
      },
      distinct: true,
      include: [
        {
          required: true,
          model: Posts,
          as: 'post',
          where: {
            authorId: userId,
            state: 3,
          },
        },
      ],
    });
    // 获取文章总阅读数量
    const postViewCount = await PostReadRecord.count({
      distinct: true,
      include: [
        {
          required: true,
          model: Posts,
          as: 'post',
          where: {
            authorId: userId,
            state: 3,
          },
        },
      ],
    });
    // 获取尺牍总点赞数量
    const stickLikeCount = await StickLikeRecord.count({
      where: {
        status: true,
      },
      distinct: true,
      include: [
        {
          required: true,
          model: Sticks,
          as: 'stick',
          where: {
            authorId: userId,
            status: 2,
          },
        },
      ],
    });
    // 这个人喜欢的文章数量
    const stickLikeCountByUser = await StickLikeRecord.count({
      where: {
        status: true,
        likeUserId: userId,
      },
    });
    const postLikeCountByUser = await PostLikeRecord.count({
      where: {
        status: true,
        likeUserId: userId,
      },
    });
    const myInclude = [];
    if (myUserId) {
      myInclude.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follow_user_id = ${myUserId} AND follow_record.status=1 AND follow_record.follower_id=user.user_id AND follow_record.deleted_at is NULL)`,
        ),
        'myFollow',
      ]);
    }
    // 获取用户数据
    const userInfo = await AccountUser.findOne({
      where: {
        userId,
      },
      attributes: {
        include: [...myInclude],
      },
    });

    return {
      userInfo,
      count: {
        stick: stickCount,
        post: postCount,
      },
      follow: {
        fan: fansCount,
        follow: followCount,
      },
      achieve: {
        postLike: postLikeCount,
        stickLike: stickLikeCount,
        postView: postViewCount,
      },
      like: {
        postLike: postLikeCountByUser,
        stickLike: stickLikeCountByUser,
        all: postLikeCountByUser + stickLikeCountByUser,
      },
    };
  }

  async getUserCenterCreatorList(
    creatorListQuery: creatorListQueryDto,
    myUserId?: number,
  ) {
    const { type, current, pageSize, userId, likeType } = creatorListQuery;
    // if(myUserId){
    //   // myInclude
    // }
    if (type === 'post') {
      const { rows, count } = await Posts.findAndCountAll({
        where: {
          authorId: userId,
          state: 3,
        },
        order: [['createdAt', 'desc']],
        limit: Number(pageSize) || 10,
        offset: Number(pageSize) * (Number(current) - 1) || 0,
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM post_read_record WHERE post_read_record.post_id = posts.post_id)`,
              ),
              'viewCount',
            ],
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM post_like_record WHERE post_like_record.post_id = posts.post_id AND post_like_record.status=1 AND post_like_record.deleted_at IS NULL)`,
              ),
              'likeCount',
            ],
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = posts.post_id)`,
              ),
              'commentCount',
            ],
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM post_comment_reply WHERE post_comment_reply.post_id = posts.post_id)`,
              ),
              'replyCount',
            ],
          ],
        },
        include: [
          {
            model: PostPlate,
            as: 'plates',
          },
          {
            model: PostColumns,
            as: 'columns',
          },
          {
            model: Tags,
            as: 'tags',
          },
          {
            model: PostSubject,
            as: 'subject',
          },
          {
            model: AccountUser,
            as: 'author',
          },
        ],
      });

      return {
        list: rows,
        total: count,
      };
    } else if (type === 'like') {
      if (likeType === 'post_like') {
        const { rows, count } = await PostLikeRecord.findAndCountAll({
          where: {
            likeUserId: userId,
            status: true,
          },
          include: [
            {
              model: Posts,
              as: 'post',
              where: {
                state: 3,
              },
              attributes: {
                include: [
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM post_like_record WHERE post_like_record.post_id = post.post_id AND post_like_record.status=1 AND post_like_record.deleted_at IS NULL)`,
                    ),
                    'likeCount',
                  ],
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = post.post_id)`,
                    ),
                    'commentCount',
                  ],
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM post_comment_reply WHERE post_comment_reply.post_id = post.post_id)`,
                    ),
                    'replyCount',
                  ],
                ],
              },
              include: [
                {
                  model: PostPlate,
                  as: 'plates',
                },
                {
                  model: PostColumns,
                  as: 'columns',
                },
                {
                  model: Tags,
                  as: 'tags',
                },
                {
                  model: PostSubject,
                  as: 'subject',
                },
                {
                  model: AccountUser,
                  as: 'author',
                },
              ],
            },
          ],
          order: [['createdAt', 'desc']],
          limit: Number(pageSize) || 10,
          offset: Number(pageSize) * (Number(current) - 1) || 0,
        });

        return {
          list: rows,
          total: count,
        };
      } else if (likeType === 'stick_like') {
        const { rows, count } = await StickLikeRecord.findAndCountAll({
          where: {
            likeUserId: userId,
            status: true,
          },
          include: [
            {
              model: Sticks,
              as: 'stick',
              where: {
                status: 2,
              },
              attributes: {
                include: [
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = stick.stick_id AND stick_like_record.status=1 AND stick_like_record.deleted_at IS NULL)`,
                    ),
                    'likeCount',
                  ],
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM stick_comment WHERE stick_comment.stick_id = stick.stick_id)`,
                    ),
                    'commentCount',
                  ],
                  [
                    this.sequelize.literal(
                      `(SELECT COUNT(*) FROM stick_comment_reply WHERE stick_comment_reply.stick_id = stick.stick_id)`,
                    ),
                    'replyCount',
                  ],
                ],
              },
              include: [
                {
                  model: AccountUser,
                  as: 'author',
                },
                {
                  model: StickThemes,
                  as: 'theme',
                },
              ],
            },
          ],
          order: [['createdAt', 'desc']],
          limit: Number(pageSize) || 10,
          offset: Number(pageSize) * (Number(current) - 1) || 0,
        });

        return {
          list: rows,
          total: count,
        };
      }
    } else if (type === 'stick') {
      const { rows, count } = await Sticks.findAndCountAll({
        where: {
          authorId: userId,
        },
        include: [
          {
            model: AccountUser,
            as: 'author',
          },
          {
            model: StickThemes,
            as: 'theme',
          },
        ],
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = sticks.stick_id AND stick_like_record.status=1 AND stick_like_record.deleted_at IS NULL)`,
              ),
              'likeCount',
            ],
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM stick_comment WHERE stick_comment.stick_id = sticks.stick_id)`,
              ),
              'commentCount',
            ],
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM stick_comment_reply WHERE stick_comment_reply.stick_id = sticks.stick_id)`,
              ),
              'replyCount',
            ],
          ],
        },
        order: [['createdAt', 'desc']],
        limit: Number(pageSize) || 10,
        offset: Number(pageSize) * (Number(current) - 1) || 0,
      });
      return {
        list: rows,
        total: count,
      };
    } else if (type === 'follow') {
      const myInclude = [];
      if (myUserId) {
        myInclude.push([
          this.sequelize.literal(
            `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follow_user_id = ${myUserId} AND follow_record.status=1 AND follow_record.follow_user_id=follow_record.follow_user_id AND follow_record.deleted_at is NULL)`,
          ),
          'myFollow',
        ]);
      }
      const { rows, count } = await FollowRecord.findAndCountAll({
        where: {
          followUserId: userId,
          status: true,
        },
        attributes: {
          include: [...myInclude],
        },
        order: [['createdAt', 'desc']],
        limit: Number(pageSize) || 10,
        offset: Number(pageSize) * (Number(current) - 1) || 0,
        include: [
          {
            model: AccountUser,
            as: 'follower',
          },
        ],
      });

      return {
        list: rows,
        total: count,
      };
    } else if (type === 'column') {
      const { rows, count } = await PostColumns.findAndCountAll({
        where: {
          status: 'published',
          ownerId: userId,
        },
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(SELECT COUNT(*) FROM post_column_record WHERE post_column_record.column_id = post_columns.column_id AND post_column_record.deleted_at is NULL)`,
              ),
              'postCount',
            ],
          ],
        },
        order: [['createdAt', 'desc']],
        limit: Number(pageSize) || 10,
        offset: Number(pageSize) * (Number(current) - 1) || 0,
      });

      return {
        list: rows,
        total: count,
      };
    }
  }

  async getFirstTaskProcess(userId: number) {
    const expTask = await ExpFireTypes.findAll({
      where: {
        first: true,
        addType: 'add',
      },
      limit: 50,
      offset: 0,
      include: [
        {
          model: ExpRecord,
          as: 'expRecord',
          required: false,
          where: {
            bindUserId: userId,
          },
        },
        {
          model: FireRecord,
          as: 'fireRecord',
          required: false,
          where: {
            bindUserId: userId,
          },
        },
      ],
    });
    return expTask;
  }

  async getGrowthTaskProcess(userId: number) {
    // 签到任务
    // const today = dayjs().format('YYYY-MM-DD');
    const todayStart = new Date(dayjs().format('YYYY-MM-DD 00:00:00'));
    const todayEnd = new Date(dayjs().format('YYYY-MM-DD 23:59:59'));
    // 签到任务列表
    const expTask = await ExpFireTypes.findAll({
      where: {
        first: false,
        addType: 'add',
      },
      limit: 50,
      offset: 0,
      include: [
        {
          model: ExpRecord,
          as: 'expRecord',
          required: false,
          where: {
            bindUserId: userId,
            createdAt: {
              [Op.lte]: todayEnd,
              [Op.gte]: todayStart,
            },
          },
        },
        {
          model: FireRecord,
          as: 'fireRecord',
          required: false,
          where: {
            bindUserId: userId,
            createdAt: {
              [Op.lte]: todayEnd,
              [Op.gte]: todayStart,
            },
          },
        },
      ],
    });

    return expTask;
  }

  async getUserCenterLevel(userId: number) {
    const level = await Levels.findAll({
      order: [['level', 'asc']],
      limit: 100,
      offset: 0,
    });

    // 获取增加的经验值
    const addExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'add',
        bindUserId: userId,
      },
    });

    // 获取减少的经验值
    const lowerExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'lower',
        bindUserId: userId,
      },
    });

    const expCount = addExpCount - lowerExpCount;

    const myLevel = await Levels.findOne({
      where: {
        minExp: { [Op.lte]: expCount },
        maxExp: { [Op.gte]: expCount },
      },
    });
    if (myLevel) {
      myLevel.setDataValue('exp', expCount);
    }

    return {
      level,
      myLevel,
    };
  }

  async getUserCenterSignCount(userId: number) {
    // 获取累计签到天数
    const signinday = await SigninRecord.count({
      where: {
        signinUserId: userId,
        status: true,
      },
    });

    // 获取增加的经验值
    const addExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'add',
        bindUserId: userId,
      },
    });

    // 获取减少的经验值
    const lowerExpCount = await ExpRecord.sum('exp', {
      where: {
        addType: 'lower',
        bindUserId: userId,
      },
    });

    // 经验值累加
    const expCount = addExpCount - lowerExpCount;

    // 获取增加的黑火值
    const addFireCount = await FireRecord.sum('fire', {
      where: {
        addType: 'add',
        bindUserId: userId,
      },
    });

    // 获取减少的黑火值
    const lowerFireCount = await FireRecord.sum('fire', {
      where: {
        addType: 'lower',
        bindUserId: userId,
      },
    });

    // 黑火值累加
    const fireCount = addFireCount - lowerFireCount;

    // 根据经验值查询所在level级别
    const levelInfo = await Levels.findOne({
      where: {
        minExp: { [Op.lte]: expCount },
        maxExp: { [Op.gte]: expCount },
      },
    });

    // 获取补签卡数量
    const signcard = await SigninCard.count({
      where: {
        status: false,
        ownerId: userId,
      },
    });

    const dailyLine = await DailyLines.findOne({
      where: {
        date: dayjs().format('YYYY-MM-DD'),
      },
    });

    return {
      signinday,
      signcard,
      fireCount,
      expCount,
      level: levelInfo,
      dailyLine: dailyLine,
    };
  }
}
