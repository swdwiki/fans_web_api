import {
  Injectable,
  HttpException,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  PostHistory,
  PostColumnRecord,
  PostPlate,
  PostPlateRecord,
  Posts,
  PostTagRecord,
  Tags,
  PostSubject,
  AccountUser,
  PostColumns,
  PostComments,
  PostCommentsReply,
  PostLikeRecord,
  PostReadRecord,
  FollowRecord,
  // ExpRecord,
  // FireRecord,
  // ExpFireTypes,
} from '../../../models/index.model';

import {
  addPostFormDto,
  PostCommentFormDto,
  PostCommentQueryDto,
  PostReplyFormDto,
  PostReplyQueryDto,
} from './post.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';
import { RedisService } from '../../default/redis/redis.service';
import { ExpService } from '../exp/exp.service';

export const STATUS_LIST = {
  draft: {
    value: 0,
    label: '草稿',
  },
  auditing: {
    value: 1,
    label: '1提交&未审核',
  },
  unpublished: {
    value: 2,
    label: '提交&审核通过未发布',
  },
  published: {
    value: 3,
    label: '提交&审核通过已发布',
  },
  injected: {
    value: 4,
    label: '提交&审核未通过',
  },
};

@Injectable()
export class PostService {
  constructor(
    private sequelize: Sequelize,

    @Inject(RedisService)
    private redisService: RedisService,

    private expService: ExpService,
  ) {}
  // 获取首页的
  async getIndexPostList(query, userId?: number) {
    //
    const { subjectId, plateId, pageSize, current } = query;
    let orders: any = [
      ['top', 'desc'],
      ['createdAt', 'desc'],
    ];
    const myInclude = [];
    if (userId) {
      myInclude.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.deleted_at IS NULL AND follow_record.follower_id = ${userId})`,
        ),
        'myFollow',
      ]);
    }
    const where: any = {
      state: 3,
    };
    const plateWhere: any = {};
    if (subjectId) {
      where.subjectId = subjectId;
      orders = [
        ['top', 'desc'],
        ['subjectTop', 'desc'],
        ['createdAt', 'desc'],
      ];
    }
    if (plateId) {
      plateWhere.plateId = plateId;
      orders = [
        ['top', 'desc'],
        ['subjectTop', 'desc'],
        ['plateTop', 'desc'],
        ['createdAt', 'desc'],
      ];
    }
    const { rows, count } = await Posts.findAndCountAll({
      where,
      limit: Number(pageSize) || 20,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [...orders],
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
          model: AccountUser,
          as: 'author',
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
                  `(SELECT COUNT(*) FROM posts WHERE posts.author_id = author.user_id AND posts.deleted_at IS NULL AND posts.state = 3)`,
                ),
                'postCount',
              ],
              ...myInclude,
            ],
          },
        },
        {
          model: Tags,
          as: 'tags',
          attributes: ['name'],
        },
        {
          model: PostSubject,
          as: 'subject',
          attributes: ['title'],
        },
        {
          model: PostPlate,
          as: 'plates',
          where: { ...plateWhere },
          attributes: ['name'],
        },
        {
          model: PostHistory,
          as: 'history',
        },
      ],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async updatePostStatus(changeStatusForm, userId) {
    const { status, postId } = changeStatusForm;
    const post = await Posts.findByPk(postId);
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    if (Number(post.getDataValue('authorId')) !== Number(userId)) {
      throw new ForbiddenException('无操作该文章的权限');
    }

    const changeStatusRes = await Posts.update(
      {
        state: status,
      },
      {
        where: {
          postId,
          authorId: userId,
        },
      },
    );

    return changeStatusRes[0] > 0;
  }

  async updatePost(updateForm, userId) {
    const {
      postId,
      content,
      editorType,
      markdownConfig,
      title,
      cover,
      desc,
      subjectId,
      columnId,
      plateId,
      tags,
    } = updateForm;
    const postInfo = await Posts.findOne({
      where: {
        postId,
      },
      include: [
        {
          model: PostHistory,
          as: 'history',
          required: false,
          where: {
            mainVersion: true,
          },
        },
        {
          model: PostColumns,
          as: 'columns',
        },
        {
          model: PostPlate,
          as: 'plates',
        },
      ],
    });
    if (!postInfo) {
      throw new HttpException('文章未找到', 404);
    }
    if (Number(postInfo.getDataValue('authorId')) !== Number(userId)) {
      throw new HttpException('无编辑更新该文章权限', 403);
    }
    try {
      const result = await this.sequelize.transaction(async (t) => {
        if (postInfo.getDataValue('history')[0].content !== content) {
          const postHistory = await PostHistory.update(
            {
              mainVersion: false,
            },
            {
              where: {
                mainVersion: true,
                postId,
              },
            },
          );

          const updateHistory = await PostHistory.create(
            {
              postId,
              mainVersion: true,
              state: 3,
              content,
              submitTime: new Date(),
              editorType,
              markdownConfig,
            },
            {
              transaction: t,
            },
          );

          return updateHistory;
        }
      });
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：文章发布错误，请联系网站管理员', 503);
    }

    // 更新文章本身
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const tagRecord = await PostTagRecord.findAll({
          where: {
            postId,
          },
          include: [
            {
              model: Tags,
              as: 'tags',
            },
          ],
          transaction: t,
        });

        if (tagRecord && tagRecord.length !== 0) {
          tagRecord.forEach((record) => {
            const index = tags.findIndex((tag) => tag === record.tags.name);
            if (index === -1) {
              record.setDataValue('state', false);
              record.destroy();
            }
          });
        }

        for (const index in tags) {
          const [tag, created] = await Tags.findOrCreate({
            where: {
              name: tags[index],
            },
            defaults: {
              name: tags[index],
            },
            transaction: t,
          });
          const [tag_record, created_record] = await PostTagRecord.findOrCreate(
            {
              where: {
                tagId: tag.getDataValue('tagId'),
                postId,
              },
              defaults: {
                tagId: tag.getDataValue('tagId'),
                postId,
              },
              transaction: t,
            },
          );
        }

        if (postInfo.getDataValue('plates')[0].plateId !== plateId) {
          await PostPlateRecord.destroy({
            where: {
              postId,
              plateId,
            },
          });
          const createRes = await PostPlateRecord.create(
            {
              postId,
              plateId,
            },
            {
              transaction: t,
            },
          );
        }
        if (postInfo.getDataValue('columns')[0].columnId !== columnId) {
          await PostColumnRecord.destroy({
            where: {
              postId,
              columnId,
            },
            transaction: t,
          });
          const createRes = await PostColumnRecord.create(
            {
              postId,
              columnId,
            },
            {
              transaction: t,
            },
          );
        }
        const updatePost = await Posts.update(
          {
            title,
            cover,
            desc,
            subjectId,
            state: 3,
            tagList: tags,
          },
          {
            where: {
              postId,
            },
            transaction: t,
          },
        );
        return updatePost[0] > 0;
      });
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：文章发布错误，请联系网站管理员', 503);
    }
  }

  async deletePost(postId: number, userId: number) {
    const post = await Posts.findByPk(postId);
    if (!post) {
      throw new HttpException('文章不存在', 404);
    }
    if (Number(post.getDataValue('authorId')) !== Number(userId)) {
      throw new ForbiddenException('你没有删除该文章的权限');
    }
    // 先删除有关的记录
    // 删除专栏部分
    const result = await this.sequelize.transaction(async (t) => {
      const removeRes_column = await PostColumnRecord.destroy({
        where: {
          postId,
        },
        transaction: t,
      });
      // 删除分类部分
      const removeRes_plate = await PostPlateRecord.destroy({
        where: {
          postId,
        },
        transaction: t,
      });
      // 删除标签部分
      const removeRes_tag = await PostTagRecord.destroy({
        where: {
          postId,
        },
        transaction: t,
      });
      // 删除历史部分
      const removeRes_history = await PostHistory.destroy({
        where: {
          postId,
        },
        transaction: t,
      });
      // 最后删除文章本身
      const removeRes_post = await Posts.destroy({
        where: {
          postId,
        },
        transaction: t,
      });

      const actionCount = await this.expService.actionExpAndFire(
        'remove_post',
        userId,
      );

      return (
        removeRes_post &&
        removeRes_column &&
        removeRes_plate &&
        removeRes_tag &&
        removeRes_history &&
        actionCount
      );
    });

    return result;
  }

  async getCreatorPostList(creatorPostListquery, user) {
    const { userId } = user;

    const { pageSize, current, status } = creatorPostListquery;

    const where: any = {
      authorId: userId,
    };

    const historywhere: any = {};

    if (status !== 'all') {
      const statusValue = STATUS_LIST[status].value;
      // historywhere.state = {
      //   [Op.eq]: statusValue,
      // };
      where.state = {
        [Op.eq]: statusValue,
      };
    } else {
      // historywhere.state = {
      //   [Op.ne]: 0,
      // };
      where.state = {
        [Op.ne]: 0,
      };
    }

    const { count, rows } = await Posts.findAndCountAll({
      where,
      distinct: true,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['createdAt', 'desc']],
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
          model: PostHistory,
          as: 'history',
          where: {
            mainVersion: true,
            // ...historywhere,
          },
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
          model: PostPlate,
          as: 'plates',
        },
      ],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async getPostDetailByUpdate(postId, userId) {
    const postInfo = await Posts.findByPk(postId);
    if (!postInfo) {
      throw new HttpException('文章不存在', 404);
    }
    if (postInfo.getDataValue('authorId') !== userId) {
      throw new ForbiddenException('无编辑本文章权限');
    }
    return await Posts.findOne({
      where: {
        postId,
      },
      include: [
        {
          required: false,
          model: PostHistory,
          as: 'history',
          where: {
            mainVersion: true,
          },
        },
        {
          model: PostColumns,
          as: 'columns',
        },
        {
          model: PostPlate,
          as: 'plates',
        },
      ],
    });
  }

  async getColumnPostList(creatorPostListquery, userId?: number) {
    const { pageSize, current, columnId } = creatorPostListquery;
    const myInclude = [];
    if (userId) {
      myInclude.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.deleted_at IS NULL AND follow_record.follower_id = ${userId})`,
        ),
        'myFollow',
      ]);
    }
    const { count, rows } = await Posts.findAndCountAll({
      distinct: true,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
        {
          model: PostHistory,
          as: 'history',
          where: {
            mainVersion: true,
            // state: 1,
          },
        },
        {
          model: Tags,
          as: 'tags',
          required: false,
          where: {
            state: true,
          },
        },
        {
          model: PostSubject,
          as: 'subject',
        },
        {
          model: PostColumns,
          as: 'columns',
          where: {
            columnId,
          },
        },
        {
          model: PostPlate,
          as: 'plates',
        },
        {
          model: AccountUser,
          as: 'author',
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
                  `(SELECT COUNT(*) FROM posts WHERE posts.author_id = author.user_id AND posts.deleted_at IS NULL AND posts.state = 3)`,
                ),
                'postCount',
              ],
              ...myInclude,
            ],
          },
        },
      ],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async getPostDetailPageData(
    postId: number | string,
    ipAddress: string,
    userId?: number,
  ) {
    // 获取文章信息
    const myIncludeCount = [];
    const time = 24 * 60 * 60;
    if (userId) {
      myIncludeCount.push([
        this.sequelize.literal(
          `(SELECT COUNT(*) FROM post_like_record WHERE post_like_record.post_id = ${postId} AND post_like_record.like_user_id = ${userId} AND post_like_record.status=1 AND post_like_record.deleted_at IS NULL)`,
        ),
        'myLike',
      ]);

      const result = await this.redisService.get(
        `view_record_posts_${postId}_viewer_${userId}`,
      );
      // 如果没有，就增加一个阅读量
      if (!result) {
        this.redisService.set(
          `view_record_posts_${postId}_viewer_${userId}`,
          new Date().valueOf(),
          time,
        );
        // await Posts.increment({ readCount: 1 }, { where: { postId } });
        await PostReadRecord.create({
          userId,
          postId,
          viewTime: new Date().valueOf(),
          ipAddress,
        });
      }
    } else {
      const result = await this.redisService.get(
        `view_record_posts_${postId}_viewer_ip_${ipAddress}`,
      );
      if (!result) {
        this.redisService.set(
          `view_record_posts_${postId}_viewer_ip_${ipAddress}`,
          new Date().valueOf(),
          time,
        );
        // await Posts.increment({ readCount: 1 }, { where: { postId } });
        await PostReadRecord.create({
          postId,
          viewTime: new Date().valueOf(),
          ipAddress,
        });
      }
    }
    const post = await Posts.findOne({
      where: {
        postId,
      },
      attributes: {
        include: [...myIncludeCount],
      },
      include: [
        {
          model: PostHistory,
          as: 'history',
          where: {
            mainVersion: true,
            // state: 3,
          },
        },
        {
          model: Tags,
          as: 'tags',
          required: false,
          where: {
            state: true,
          },
        },
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
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(SELECT COUNT(*) FROM posts WHERE posts.author_id = author.user_id AND posts.deleted_at IS NULL AND posts.state = 3)`,
                ),
                'postCount',
              ],
              [
                this.sequelize.literal(
                  userId
                    ? `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.follow_user_id = ${userId} AND follow_record.status=1 AND follow_record.deleted_at IS NULL)`
                    : `(SELECT COUNT(*) FROM follow_record WHERE follow_record.follower_id = author.user_id AND follow_record.follow_user_id = -1 AND follow_record.status=1 AND follow_record.deleted_at IS NULL)`,
                ),
                'myFollow',
              ],
            ],
          },
        },
        {
          model: PostColumns,
          as: 'columns',
        },
      ],
    });

    const { rows, count } = await PostComments.findAndCountAll({
      where: {
        postId,
        status: 1,
      },
      limit: 5,
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
      const replys = await PostCommentsReply.findAndCountAll({
        where: {
          commentId,
          postId,
          status: 1,
        },
        order: [['createdAt', 'desc']],
        limit: 5,
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

    const authorId = post.getDataValue('authorId');

    // 粉丝数量
    const followerCount = await FollowRecord.count({
      where: {
        followerId: authorId,
      },
    });
    // 关注数量
    const followCount = await FollowRecord.count({
      where: {
        followUserId: authorId,
      },
    });

    const postCount = await Posts.count({
      where: {
        // status:3,
        authorId: authorId,
      },
    });

    const readCount = await PostReadRecord.count({
      include: [
        {
          model: Posts,
          as: 'post',
          where: {
            authorId: authorId,
          },
        },
      ],
    });

    const postCommentCounts = await PostComments.count({
      where: {
        postId,
        status: 1,
      },
    });

    const postReplyCounts = await PostCommentsReply.count({
      where: {
        postId,
        status: 1,
      },
    });

    const postLikeCounts = await PostLikeRecord.count({
      where: {
        postId,
        status: true,
      },
    });

    const authorCounts = {
      followerCount,
      readCount,
      postCount,
      followCount,
    };

    const postCounts = {
      likeCount: postLikeCounts,
      commentCount: postCommentCounts + postReplyCounts,
    };

    // 计算数量

    return {
      post,
      authorCounts,
      comments,
      postCounts,
    };
  }

  async sendComment(commentForm: PostCommentFormDto, userId: number) {
    // 查询上一次评论时间
    const { content, images, postId } = commentForm;
    const findPost = await Posts.findByPk(postId);
    if (!findPost) {
      throw new HttpException('文章不存在或状态异常', 403);
    }
    const contentStickRecord = await PostComments.count({
      where: {
        content,
        postId,
        commentAccountId: userId,
        createdAt: {
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
    try {
      const result = await this.sequelize.transaction(async (t) => {
        // 发布评论Id
        const commentRes = await PostComments.create(
          {
            postId,
            content,
            images,
            commentAccountId: userId,
            commentTime: new Date(),
          },
          {
            transaction: t,
          },
        );
        const actionCount = await this.expService.actionExpAndFire(
          'comment_post',
          userId,
        );

        return commentRes;
      });

      return result;
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：文章发布错误，请联系网站管理员', 503);
    }
  }

  async getCommentList(commentQuery: PostCommentQueryDto) {
    const { current, pageSize, postId } = commentQuery;
    const { rows, count } = await PostComments.findAndCountAll({
      where: {
        postId,
        status: 1,
      },
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: AccountUser,
          as: 'commentAccount',
        },
      ],
    });
    for (const index in rows) {
      const replys = await PostCommentsReply.findAndCountAll({
        where: {
          commentId: rows[index].getDataValue('commentId'),
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
    return {
      list: rows,
      total: count,
    };
  }

  async getReplyList(replyQuery: PostReplyQueryDto) {
    const { current, pageSize, commentId } = replyQuery;
    const { rows, count } = await PostCommentsReply.findAndCountAll({
      where: {
        commentId,
        status: 1,
      },
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
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
    return {
      list: rows,
      total: count,
    };
  }

  // 用户将文章存储为草稿
  async savePost(postForm: addPostFormDto, user: any) {
    const {
      title,
      desc,
      content,
      columnId,
      cover,
      // activityId,
      tags,
      subjectId,
      plateId,
      editorType,
      markdownConfig,
    } = postForm;
    const { userId } = user;

    // 先创建文章，然后将草稿中的值作为数据插入进去

    try {
      const result = await this.sequelize.transaction(async (t) => {
        const tagsOr = [];
        const tagsIds = [];
        // 获取全部tags，然后进行查询
        // 先查询tag仓库有没有
        tags.forEach(async (taginfo) => {
          tagsOr.push(taginfo);
          const [tag, created] = await Tags.findOrCreate({
            where: {
              name: taginfo,
            },
            defaults: {
              name: taginfo,
            },
            transaction: t,
          });
        });

        const tagModelData = await Tags.findAll({
          where: {
            name: {
              [Op.or]: tagsOr,
            },
          },
        });

        // console.log(tagModelData);

        // 获得新的tagId列表
        tagModelData.forEach((tagData) => {
          tagsIds.push({
            tagId: tagData.getDataValue('tagId'),
          });
        });

        // 先创建文章
        const post = await Posts.create(
          {
            title,
            cover,
            desc,
            subjectId,
            authorId: userId,
            tagList: tags,
          },
          { transaction: t },
        );

        const postId = post.getDataValue('postId');

        const tagCreateForm = tagsIds.map((tag) => {
          return {
            tagId: tag.tagId,
            postId: postId,
          };
        });

        // console.log(tagCreateForm);

        const tagRecords = await PostTagRecord.bulkCreate([...tagCreateForm], {
          transaction: t,
        });

        // 创建分类下板块的记录
        const PlateRecord = await PostPlateRecord.create(
          {
            postId,
            plateId,
            state: true,
          },
          {
            transaction: t,
          },
        );

        // 创建文章对应的专栏记录
        const columnPostRecord = await PostColumnRecord.create(
          {
            postId,
            columnId,
          },
          {
            transaction: t,
          },
        );

        // 创建文章对应的文章历史记录
        const PostHistoryRecord = await PostHistory.create(
          {
            state: 1,
            mainVersion: true,
            content,
            postId: post.getDataValue('postId'),
            editorType,
            markdownConfig,
          },
          {
            transaction: t,
          },
        );

        return (
          PostHistoryRecord &&
          columnPostRecord &&
          post &&
          tagRecords &&
          PlateRecord
        );
      });

      return result;
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：文章发布错误，请联系网站管理员', 503);
    }
  }

  // 用户提交文章
  async createPost(postForm: addPostFormDto, user: any) {
    const {
      title,
      desc,
      content,
      columnId,
      cover,
      // activityId,
      tags,
      subjectId,
      plateId,
      editorType,
      markdownConfig,
    } = postForm;
    const { userId } = user;

    // 先创建文章，然后再创建文章记录,需要事务

    try {
      const tagsIds = [];
      const result = await this.sequelize.transaction(async (t) => {
        if (tags && tags.length !== 0) {
          for (const index in tags) {
            const [tag, created] = await Tags.findOrCreate({
              where: {
                name: tags[index],
              },
              defaults: {
                name: tags[index],
              },
              transaction: t,
            });
            tagsIds.push({
              tagId: tag.getDataValue('tagId'),
            });
          }
        }

        // 先创建文章
        const post = await Posts.create(
          {
            title,
            cover,
            desc,
            subjectId,
            authorId: userId,
            tagList: tags,
            state: 3,
          },
          { transaction: t },
        );

        const postId = post.getDataValue('postId');

        const tagCreateForm = tagsIds.map((tagInfo) => {
          return {
            tagId: tagInfo.tagId,
            postId: postId,
            state: true,
          };
        });

        const tagRecords = await PostTagRecord.bulkCreate([...tagCreateForm], {
          transaction: t,
        });

        // 创建分类下板块的记录
        const PlateRecord = await PostPlateRecord.create(
          {
            postId,
            plateId,
            state: true,
          },
          {
            transaction: t,
          },
        );

        // 创建文章对应的专栏记录
        const columnPostRecord = await PostColumnRecord.create(
          {
            postId,
            columnId,
          },
          {
            transaction: t,
          },
        );

        // 创建文章对应的文章历史记录
        const PostHistoryRecord = await PostHistory.create(
          {
            state: 3,
            mainVersion: true,
            content,
            postId: post.getDataValue('postId'),
            editorType,
            markdownConfig,
          },
          {
            transaction: t,
          },
        );

        // 第一次

        const firstCount = await Posts.count({
          where: {
            authorId: userId,
            state: 3,
          },
        });

        const actionCount = await this.expService.actionExpAndFire(
          firstCount === 1 ? 'first_post' : 'post',
          userId,
        );

        return (
          PostHistoryRecord &&
          columnPostRecord &&
          post &&
          tagRecords &&
          PlateRecord &&
          actionCount
        );
      });

      return result;
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
      console.log(error);
      throw new HttpException('服务错误：文章发布错误，请联系网站管理员', 503);
    }
  }

  async sendReply(postReplyForm: PostReplyFormDto, userId: number) {
    const { content, images, postId, receiverId, commentId } = postReplyForm;

    const findPost = await Posts.findByPk(postId);
    if (!findPost) {
      throw new HttpException('文章不存在或状态异常', 403);
    }
    const findComment = await PostComments.findByPk(commentId);
    if (!findComment || findComment.getDataValue('status') !== 1) {
      throw new HttpException('评论不存在或状态异常', 403);
    }
    const contentPostReplyRecord = await PostCommentsReply.count({
      where: {
        content,
        postId,
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

    if (contentPostReplyRecord > 0) {
      throw new HttpException('评论内容相同，请相隔5分钟后再发表', 403);
    }

    const replyRes = await PostCommentsReply.create({
      content,
      postId,
      replyAccountId: userId,
      images,
      receivedAccountId: receiverId,
      commentId,
    });
    const actionCount = await this.expService.actionExpAndFire(
      'comment_post',
      userId,
    );

    return replyRes;
  }

  async likePost(postId: number, userId: number) {
    const findPost = await Posts.findByPk(postId);
    // 查询是否存在like数据
    if (!findPost) {
      throw new HttpException('未找到该文章', 404);
    }
    // 存在，则获取点赞状态，然后取反
    const findLikeRecord = await PostLikeRecord.findOne({
      where: {
        postId,
        likeUserId: userId,
      },
    });

    // 不存在则直接创建数据
    if (!findLikeRecord) {
      const likeRes = await PostLikeRecord.create({
        status: true,
        likeUserId: userId,
        postId,
      });
      const actionCount = await this.expService.actionExpAndFire(
        'like_post',
        userId,
      );
      return likeRes;
    } else {
      const likeStatus = findLikeRecord.getDataValue('status');
      const like = !likeStatus;
      findLikeRecord.status = like;
      findLikeRecord.save();
      return findLikeRecord;
    }
  }
}
