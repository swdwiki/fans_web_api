import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Tags, Posts } from '../../../../models/index.model';
import {
  CreateTagsDto,
  TagsDto,
  UpdateTagsDto,
  TagListDataDto,
} from '../dto/post.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class AdminTagsService {
  async list(query): Promise<TagListDataDto> {
    const { name, current, pageSize } = query;
    const where: any = {};
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }
    const { rows, count } = await Tags.findAndCountAll({
      where,
      distinct: true,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
      include: [
        {
          model: Posts,
          as: 'posts',
          duplicating: false,
        },
      ],
      // attributes: {
      //   include: [
      //     [Sequelize.fn('COUNT', Sequelize.col('posts.post_id')), 'postNum'],
      //   ],
      // },
    });
    return {
      list: rows,
      total: count,
    };
  }

  async create(addTagsForm: CreateTagsDto): Promise<TagsDto> {
    const { name } = addTagsForm;
    const tag = await Tags.findOne({
      where: {
        name,
      },
    });

    if (tag) {
      throw new HttpException('标签名称重复', 200);
    }
    return await Tags.create({
      ...addTagsForm,
    });
  }

  async update(updateTagsForm: UpdateTagsDto): Promise<boolean> {
    const { tagId, ...updateForm } = updateTagsForm;
    const tag = await Tags.findByPk(tagId);
    if (!tag) {
      throw new HttpException('标签不存在', 404);
    }
    const updateState = await Tags.update(
      {
        ...updateForm,
      },
      {
        where: {
          tagId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async delete(tagId: number | string): Promise<number> {
    const tag = await Tags.findByPk(tagId);

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }
    return await Tags.destroy({
      where: {
        tagId,
      },
    });
  }

  async changeState(tagId: number | string): Promise<any> {
    const subject = await Tags.findByPk(tagId);

    if (!subject) {
      throw new HttpException('标签不存在', 404);
    }
    const updateState = await Tags.update(
      {
        state: subject.getDataValue('state') === 1 ? 2 : 1,
      },
      {
        where: { tagId },
      },
    );

    return updateState[0] > 0;
  }

  async changeSort(changeTagSort: {
    tagId: number | string;
    sort: number;
  }): Promise<boolean> {
    const { tagId, sort } = changeTagSort;
    const tag = await Tags.findByPk(tagId);

    if (!tag) {
      throw new HttpException('标签不存在', 404);
    }
    const updateSort = await Tags.update(
      {
        sort,
      },
      {
        where: { tagId },
      },
    );

    return updateSort[0] > 0;
  }
}
