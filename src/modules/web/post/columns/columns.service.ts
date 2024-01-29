import {
  BadRequestException,
  HttpException,
  Injectable,
  Post,
} from '@nestjs/common';
import {
  CreatePostColumnDto,
  UpdatePostColumnDto,
  PostColumnListQueryDto,
} from './dto/column.dto';
import {
  PostColumns,
  PostColumnRecord,
  Posts,
  AccountUser,
  PostSubject,
  PostPlate,
  Tags,
} from '../../../../models/index.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ColumnsService {
  constructor(private sequelize: Sequelize) {}
  async create(createColumnDto: CreatePostColumnDto, user: any) {
    const { userId } = user;
    const { name } = createColumnDto;
    const column = await PostColumns.findOne({
      where: {
        name,
        ownerId: userId,
      },
    });
    if (column) {
      throw new HttpException('你已经创建过同名专栏', 400);
    }
    return await PostColumns.create({
      ...createColumnDto,
      ownerId: userId,
    });
  }

  async findList(listQuery: PostColumnListQueryDto, user: any) {
    const { userId } = user;
    const { current, pageSize, status } = listQuery;
    const where: any = {
      ownerId: userId,
    };

    if (status) {
      where.status = status;
    }
    const { rows, count } = await PostColumns.findAndCountAll({
      where,
      limit: Number(pageSize) || 12,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      include: [
        {
          model: Posts,
          as: 'posts',
        },
      ],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async findAll(user: any) {
    const { userId } = user;

    return await PostColumns.findAll({
      where: {
        status: 'published',
        ownerId: userId,
      },
      limit: 100,
      offset: 0,
    });
  }

  async findOneByUser(columnId: number, user: any) {
    // return `This action returns a #${id} column`;
    const { userId } = user;
    // 找数据
    await PostColumns.findOne({
      where: {
        columnId,
        userId,
      },
      include: [
        {
          model: Posts,
          as: 'posts',
        },
      ],
    });
  }

  async findOneByPublic(columnId: number) {
    const column = await PostColumns.findOne({
      where: {
        columnId,
      },
      include: [
        {
          model: Posts,
          as: 'posts',
          attributes: ['postId'],
          // attributes: [
          //   'postId',
          //   [
          //     this.sequelize.fn('COUNT', this.sequelize.col('postId')),
          //     'posts_count',
          //   ],
          // ],
        },
        {
          model: AccountUser,
          as: 'user',
        },
      ],
      attributes: {
        // include: [
        //   [
        //     this.sequelize.fn('COUNT', this.sequelize.col('posts')),
        //     'posts_count',
        //   ],
        // ],
        exclude: ['deletedAt', 'updatedAt'],
      },
    });

    if (!column) {
      throw new HttpException('专栏不存在', 404);
    }

    return column;
  }

  async update(updateColumnDto: UpdatePostColumnDto, user: any) {
    const { userId } = user;
    const { columnId, status, ...updateForm } = updateColumnDto;
    const column = await PostColumns.findByPk(columnId);
    if (!column) {
      throw new HttpException('专栏不存在', 404);
    }
    if (column.getDataValue('ownerId') !== userId) {
      throw new HttpException('无权限操作该专栏', 404);
    }
    const updateState = await PostColumns.update(
      {
        ...updateForm,
        status: 'auditing',
      },
      {
        where: {
          columnId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async remove(columnId: number, user: any) {
    const { userId } = user;
    const column = await PostColumns.findByPk(columnId);
    if (!column) {
      throw new HttpException('专栏不存在', 404);
    }
    if (column.getDataValue('ownerId') !== userId) {
      throw new HttpException('无权限操作该专栏', 403);
    }
    const columnPostRecord = await PostColumnRecord.count({
      where: {
        columnId,
      },
    });
    if (columnPostRecord > 0) {
      throw new HttpException('当前专栏有文章，请移除专栏内文章后再删除', 400);
    }

    return await PostColumns.destroy({
      where: {
        columnId,
        ownerId: userId,
      },
    });
  }
}
