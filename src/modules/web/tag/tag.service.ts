import { Injectable } from '@nestjs/common';
import { TagListDataDto, TagListQueryDto } from '../../dto_vo/tag/tag.dto';
import { Tags } from '../../../models/index.model';
import { Op } from 'sequelize';

@Injectable()
export class TagService {
  async list(query): Promise<TagListDataDto> {
    const { name, current, pageSize } = query;
    const where: any = {
      state: true,
    };
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }
    const { rows, count } = await Tags.findAndCountAll({
      where,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'sort',
          'desc',
          'state',
        ],
      },
    });
    return {
      list: rows,
      total: count,
    };
  }
}
