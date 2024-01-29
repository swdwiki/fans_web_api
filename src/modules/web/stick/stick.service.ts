import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountUser,
  StickClubs,
  StickThemes,
  Sticks,
  StickLikeRecord,
  StickComments,
  StickCommentsReply,
} from '../../../models/index.model';
import {
  createStickClubDto,
  updateStickClubDto,
  stickClubListDto,
  createStickThemeDto,
  updateStickThemeDto,
  stickThemeListDto,
  stickListDto,
  createStickDto,
  stickCommentReplyDto,
  stickCommentDto,
  commentReplyQueryDto,
} from './dto_vo/stick.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as dayjs from 'dayjs';
import { ExpService } from '../exp/exp.service';

export const STATUS_LIST = {
  auditing: {
    value: 1,
    label: '1提交&未审核',
  },
  published: {
    value: 2,
    label: '提交&审核通过已发布',
  },
  unpublished: {
    value: 3,
    label: '提交&审核通过未发布/下架',
  },
  injected: {
    value: 4,
    label: '提交&审核未通过',
  },
};

@Injectable()
export class StickService {
  constructor(private sequelize: Sequelize, private expService: ExpService) {}

  async createStickClub(createStickClubForm: createStickClubDto) {
    const { name, desc, state, sort } = createStickClubForm;

    const findStickClub = await StickClubs.findOne({
      where: {
        name,
      },
    });
    if (findStickClub) {
      throw new HttpException('存在重复圈子名称', 403);
    }
    const createRes = await StickClubs.create({
      name,
      desc,
      state,
      sort,
    });

    return createRes;
  }

  async updateStickClub(updateStickClubForm: updateStickClubDto) {
    const { clubId, ...updateForm } = updateStickClubForm;

    const findStickClub = await StickClubs.findByPk(clubId);

    if (!findStickClub) {
      throw new HttpException('未找到该圈子', 404);
    }

    const updateRes = await StickClubs.update(
      {
        ...updateForm,
      },
      {
        where: {
          clubId,
        },
      },
    );

    return updateRes[0] > 0;
  }

  async deleteStickClub(clubId: number) {
    const findStickClub = await StickClubs.findByPk(clubId);

    if (!findStickClub) {
      throw new HttpException('未找到该圈子', 404);
    }

    const findStickThemeByClub = await StickThemes.count({
      where: {
        clubId,
      },
    });

    if (findStickThemeByClub !== 0) {
      throw new HttpException('圈子存在主题，请清空圈子内主题后再删除', 403);
    }

    return await StickClubs.destroy({
      where: {
        clubId,
      },
    });
  }

  async getStickClubList(stickClubListQuery: stickClubListDto) {
    const { current, pageSize, name } = stickClubListQuery;
    const where: any = {};
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }
    const { rows, count } = await StickClubs.findAndCountAll({
      where,
      limit: Number(pageSize) || 20,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
        {
          model: StickThemes,
          as: 'themes',
          separate: true,
          right: true,
          order: [['sort', 'asc']],
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM sticks WHERE sticks.theme_id = stick_themes.theme_id AND sticks.deleted_at IS NULL AND sticks.status=2)`,
                ),
                'stickCount',
              ],
            ],
          },
        },
      ],
    });

    return {
      total: count,
      list: rows,
    };
  }

  async getStickThemeList(stickThemeListQuery: stickThemeListDto) {
    const { current, pageSize, clubId, name } = stickThemeListQuery;
    const where: any = {};
    if (clubId) {
      where.clubId = clubId;
    }
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }
    const { rows, count } = await StickThemes.findAndCountAll({
      where,
      limit: Number(pageSize) || 50,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async createStickTheme(createStickThemeForm: createStickThemeDto) {
    const { name, desc, state, sort, clubId, notice, cover } =
      createStickThemeForm;

    const findStickClub = await StickClubs.findOne({
      where: {
        clubId,
      },
    });

    if (!findStickClub) {
      throw new HttpException('圈子未找到或不存在', 404);
    }

    const findStickTheme = await StickThemes.findOne({
      where: {
        name,
        clubId,
      },
    });

    if (findStickTheme) {
      throw new HttpException('在该圈子中存在重复主题名称', 403);
    }

    const createRes = await StickThemes.create({
      name,
      desc,
      state,
      sort,
      notice,
      clubId,
      cover,
    });

    return createRes;
  }

  async updateStickTheme(updateStickThemeForm: updateStickThemeDto) {
    const { themeId, clubId, ...updateForm } = updateStickThemeForm;

    const findStickTheme = await StickThemes.findByPk(themeId);

    if (!findStickTheme) {
      throw new HttpException('未找到该圈子主题', 404);
    }

    const findStickClub = await StickClubs.findByPk(clubId);

    if (!findStickClub) {
      throw new HttpException('未找到该圈子', 404);
    }

    const updateRes = await StickClubs.update(
      {
        ...updateForm,
        clubId,
      },
      {
        where: {
          themeId,
        },
      },
    );

    return updateRes[0] > 0;
  }

  async deleteStickTheme(themeId: number) {
    const findStickTheme = await StickThemes.findByPk(themeId);

    if (!findStickTheme) {
      throw new HttpException('未找到该圈子主题', 404);
    }

    // 需要对尺牍数量进行判断

    // const findStickCountByTheme = await Sticks.count({
    //   where: {
    //     themeId,
    //   },
    // });

    // if (findStickCountByTheme > 0) {
    //   throw new HttpException('该主题下有尺牍内容，不可删除', 403);
    // }

    return await StickThemes.destroy({
      where: {
        themeId,
      },
    });
  }

  // 尺牍相关
  async getStickList(stickListQuery: stickListDto, userId?: number) {
    const { current, pageSize, content, themeId } = stickListQuery;
    const myIncludeCount = [];
    if (userId) {
      myIncludeCount.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = sticks.stick_id AND stick_like_record.like_user_id = ${userId} AND stick_like_record.status=1 AND stick_like_record.deleted_at IS NULL)`,
        ),
        'myLikeStick',
      ]);
    }
    const where: any = {};

    const myInclude = [];
    if (userId) {
      myInclude.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.deleted_at IS NULL AND follow_record.follower_id = ${userId})`,
        ),
        'myFollow',
      ]);
    }

    if (content) {
      where.content = {
        [Op.like]: `%${content}%`,
      };
    }
    if (themeId) {
      where.themeId = themeId;
    }

    const { rows, count } = await Sticks.findAndCountAll({
      where: {
        ...where,
      },
      limit: Number(pageSize) || 20,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['createdAt', 'desc']],
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
          ...myIncludeCount,
        ],
      },
      include: [
        {
          model: AccountUser,
          as: 'author',
          required: false,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.status=1 AND follow_record.deleted_at is NULL)`,
                ),
                'fanCount',
              ],
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follow_user_id = author.user_id AND follow_record.status=1 AND follow_record.deleted_at is NULL)`,
                ),
                'followCount',
              ],
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM sticks WHERE sticks.author_id = author.user_id AND sticks.deleted_at IS NULL AND sticks.status = 2)`,
                ),
                'stickCount',
              ],
              ...myInclude,
            ],
          },
        },
        {
          model: StickThemes,
          as: 'theme',
        },
        {
          model: StickLikeRecord,
          as: 'likes',
          separate: true,
          required: false,
          where: {
            status: true,
          },
          include: [
            {
              model: AccountUser,
              as: 'likeUser',
              attributes: ['userId', 'nickname', 'avatar', 'desc'],
            },
          ],
        },
      ],
    });

    for (const rowIndex in rows) {
      const stickComment = await StickComments.findAndCountAll({
        where: {
          stickId: rows[rowIndex].getDataValue('stickId'),
        },
        limit: 5,
        offset: 0,
        order: [['createdAt', 'desc']],
        include: [
          {
            model: AccountUser,
            as: 'commentAccount',
            required: false,
            attributes: ['userId', 'nickname', 'avatar', 'desc'],
          },
        ],
      });

      for (const commentIndex in stickComment.rows) {
        const replys = await StickCommentsReply.findAndCountAll({
          limit: 5,
          offset: 0,
          where: {
            status: 1,
            commentId: stickComment.rows[commentIndex].commentId,
          },
          order: [['createdAt', 'desc']],
          include: [
            {
              model: AccountUser,
              as: 'receivedAccount',
            },
            {
              model: AccountUser,
              as: 'replyAccount',
            },
          ],
        });

        stickComment.rows[commentIndex].setDataValue('replys', {
          list: replys.rows,
          total: replys.count,
        });
      }

      rows[rowIndex].setDataValue('comments', {
        list: stickComment.rows,
        total: stickComment.count,
      });
    }

    return {
      list: rows,
      total: count,
    };
  }

  async getCreatorStickList(listQuery, userId) {
    const { pageSize, current, status } = listQuery;
    const where: any = [];
    if (status !== 'all') {
      const statusValue = STATUS_LIST[status].value;
      where.status = {
        [Op.eq]: statusValue,
      };
    } else {
      where.status = {
        [Op.ne]: 0,
      };
    }
    const { rows, count } = await Sticks.findAndCountAll({
      where: {
        authorId: userId,
        ...where,
      },
      order: [['createdAt', 'desc']],
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
      limit: Number(pageSize) || 20,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
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
  }

  async getStickDetail(stickId: number, userId?: number) {
    const findStick = await Sticks.findByPk(stickId);
    if (!findStick) {
      throw new NotFoundException('尺牍不存在');
    }
    const myIncludeCount = [];
    if (userId) {
      myIncludeCount.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = ${stickId} AND stick_like_record.like_user_id = ${userId})`,
        ),
        'myLikeStick',
      ]);
      myIncludeCount.push([
        this.sequelize.literal(
          userId
            ? `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.follow_user_id = ${userId} AND follow_record.status=1 AND follow_record.deleted_at IS NULL)`
            : `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.follow_user_id = -1 AND follow_record.status=1 AND follow_record.deleted_at IS NULL)`,
        ),
        'myFollow',
      ]);
    }
    const stick = await Sticks.findOne({
      where: {
        stickId,
      },
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_like_record WHERE stick_like_record.stick_id = ${stickId})`,
            ),
            'likeCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_comment WHERE stick_comment.stick_id = ${stickId})`,
            ),
            'commentCount',
          ],
          [
            this.sequelize.literal(
              `(SELECT COUNT(*) FROM stick_comment_reply WHERE stick_comment_reply.stick_id = ${stickId})`,
            ),
            'replyCount',
          ],
          ...myIncludeCount,
        ],
      },
      include: [
        {
          model: AccountUser,
          as: 'author',
          required: false,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM sticks WHERE sticks.author_id = author.user_id AND sticks.deleted_at IS NULL AND sticks.status=2)`,
                ),
                'stickCount',
              ],
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.deleted_at IS NULL AND follow_record.status=1)`,
                ),
                'followCount',
              ],
            ],
          },
        },
        {
          model: StickLikeRecord,
          as: 'likes',
          required: false,
          where: {
            status: true,
          },
          include: [
            {
              model: AccountUser,
              as: 'likeUser',
              required: false,
              attributes: ['userId', 'nickname', 'avatar', 'desc'],
            },
          ],
        },
      ],
    });

    const { rows, count } = await StickComments.findAndCountAll({
      where: {
        stickId,
        status: 1,
      },
      limit: 10,
      offset: 0,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: AccountUser,
          as: 'commentAccount',
        },
      ],
    });

    for (const index in rows) {
      const commentId = rows[index].getDataValue('commentId');
      const replys = await StickCommentsReply.findAndCountAll({
        where: {
          commentId,
          stickId,
          status: 1,
        },
        order: [['createdAt', 'desc']],
        limit: 10,
        offset: 0,
        include: [
          {
            model: AccountUser,
            as: 'receivedAccount',
          },
          {
            model: AccountUser,
            as: 'replyAccount',
          },
        ],
      });

      rows[index].setDataValue('replys', {
        list: replys.rows,
        total: replys.count,
      });
    }

    const comments = {
      list: rows,
      total: count,
    };

    return {
      stick,
      comments,
    };
  }

  async createStick(createStickForm: createStickDto, userId: number) {
    const { content, imgList, status, themeId, link } = createStickForm;

    const createRes = await Sticks.create({
      content,
      imgList,
      status: status || 2,
      themeId,
      link,
      authorId: userId,
    });

    const firstCount = await Sticks.count({
      where: {
        authorId: userId,
        status: 2,
      },
    });

    const actionCount = await this.expService.actionExpAndFire(
      firstCount === 1 ? 'first_stick' : 'stick',
      userId,
    );

    return createRes && actionCount;
  }

  async likeStick(stickId: number, userId: number) {
    const findStick = await Sticks.findByPk(stickId);
    // 查询是否存在like数据
    if (!findStick) {
      throw new HttpException('未找到该尺牍', 404);
    }
    // 存在，则获取点赞状态，然后取反
    const findLikeRecord = await StickLikeRecord.findOne({
      where: {
        stickId,
        likeUserId: userId,
      },
    });

    // 不存在则直接创建数据
    if (!findLikeRecord) {
      const likeRes = await StickLikeRecord.create({
        status: true,
        likeUserId: userId,
        stickId,
      });
      const actionCount = await this.expService.actionExpAndFire(
        'like_stick',
        userId,
      );
      return likeRes;
    } else {
      const likeStatus = findLikeRecord.getDataValue('status');
      findLikeRecord.status = !likeStatus;
      findLikeRecord.save();
      return findLikeRecord;
    }
  }

  async commentStick(stickCommentForm: stickCommentDto, userId: number) {
    const { content, images, stickId } = stickCommentForm;
    const findStick = await Sticks.findByPk(stickId);
    if (!findStick || findStick.getDataValue('status') !== 2) {
      throw new HttpException('尺牍不存在或状态异常', 403);
    }
    const contentStickRecord = await StickComments.count({
      where: {
        content,
        stickId,
        commentAccountId: userId,
        commentTime: {
          [Op.gte]: new Date(
            dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
          ),
          [Op.lte]: new Date(),
        },
      },
    });
    if (contentStickRecord > 0) {
      throw new HttpException('评论内容相同，请相隔10分钟后再发表', 403);
    }
    const commentRes = await StickComments.create({
      content,
      stickId,
      commentAccountId: userId,
      images,
    });
    const actionCount = await this.expService.actionExpAndFire(
      'comment_stick',
      userId,
    );
    return commentRes;
  }

  async getStickCommentList(commentListQuery: any) {
    const { current, pageSize, stickId } = commentListQuery;
    const findStick = await Sticks.findByPk(stickId);
    if (!findStick || findStick.getDataValue('status') !== 2) {
      throw new HttpException('尺牍不存在或状态异常', 403);
    }
    const { count, rows } = await StickComments.findAndCountAll({
      where: {
        stickId,
        status: 1,
      },
      order: [['createdAt', 'desc']],
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
        {
          model: AccountUser,
          as: 'commentAccount',
          required: false,
        },
      ],
    });

    for (const commentIndex in rows) {
      const replys = await StickCommentsReply.findAndCountAll({
        limit: 10,
        offset: 0,
        where: {
          commentId: rows[commentIndex].commentId,
        },
        order: [['createdAt', 'desc']],
        include: [
          {
            model: AccountUser,
            as: 'receivedAccount',
            required: false,
          },
          {
            model: AccountUser,
            as: 'replyAccount',
            required: false,
          },
        ],
      });
      rows[commentIndex].setDataValue('replys', {
        list: replys.rows,
        total: replys.count,
      });
    }
    return {
      list: rows,
      total: count,
    };
  }

  async getRecommendStickList() {
    return await Sticks.findAll({
      // where: {
      //   recommend: true,
      // },
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
      order: this.sequelize.random(),
      limit: 3,
      offset: 0,
    });
  }

  async replyStickComment(
    stickCommentReplyForm: stickCommentReplyDto,
    userId: number,
  ) {
    const { content, images, stickId, receiverId, commentId } =
      stickCommentReplyForm;

    const findStick = await Sticks.findByPk(stickId);
    if (!findStick || findStick.getDataValue('status') !== 2) {
      throw new HttpException('尺牍不存在或状态异常', 403);
    }
    const findComment = await StickComments.findByPk(commentId);
    if (!findComment || findComment.getDataValue('status') !== 1) {
      throw new HttpException('评论不存在或状态异常', 403);
    }
    const contentStickReplyRecord = await StickCommentsReply.count({
      where: {
        content,
        stickId,
        commentId,
        receivedAccountId: receiverId,
        replyAccountId: userId,
        commentTime: {
          [Op.gte]: new Date(
            dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
          ),
          [Op.lte]: new Date(),
        },
      },
    });
    if (contentStickReplyRecord > 0) {
      throw new HttpException('评论内容相同，请相隔5分钟后再发表', 403);
    }

    const replyRes = await StickCommentsReply.create({
      content,
      stickId,
      replyAccountId: userId,
      images,
      receivedAccountId: receiverId,
      commentId,
    });

    const actionCount = await this.expService.actionExpAndFire(
      'comment_stick',
      userId,
    );

    return replyRes;
  }

  async getCommentReplyList(commentReplyQuery: commentReplyQueryDto) {
    const { current, pageSize, commentId } = commentReplyQuery;
    console.log(current, commentId);
    const { rows, count } = await StickCommentsReply.findAndCountAll({
      where: {
        commentId,
      },
      order: [['createdAt', 'desc']],
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
        {
          model: AccountUser,
          as: 'receivedAccount',
          required: false,
        },
        {
          model: AccountUser,
          as: 'replyAccount',
          required: false,
        },
      ],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async commentMessageCount() {
    const count = await StickComments.count({
      include: [
        {
          model: Sticks,
          as: 'stick',
          where: {
            authorId: 1,
          },
        },
      ],
    });

    return count;
  }

  async deleteStick(stickId: number, userId: number) {
    const findStick = await Sticks.findByPk(stickId);
    if (!findStick) {
      throw new HttpException('未找到该尺牍', 404);
    }

    if (Number(findStick.getDataValue('authorId')) !== Number(userId)) {
      throw new HttpException('无权限删除非本人发布的尺牍', 403);
    }

    try {
      return findStick.destroy();
    } catch (err) {
      throw new HttpException('删除尺牍失败,请联系管理员', 400);
    }
  }
}
