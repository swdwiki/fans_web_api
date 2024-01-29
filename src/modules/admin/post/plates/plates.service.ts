import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostSubject, PostPlate } from '../../../../models/index.model';
import {
  CreatePostPlatesDto,
  PostPlatesDto,
  UpdatePostPlatesDto,
  PostPlateListDataDto,
} from '../dto/post.dto';

@Injectable()
export class AdminPlatesService {
  async list(query): Promise<PostPlateListDataDto> {
    const { subjectId, current, pageSize } = query;
    const subject = await PostSubject.findByPk(subjectId);
    if (subjectId && !subject) {
      throw new NotFoundException('未找到专题，请重新尝试');
    }
    const where: any = {};
    if (subjectId) {
      where.subjectId = subjectId;
    }
    const { rows, count } = await PostPlate.findAndCountAll({
      where,
      distinct: true,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
      include: [
        {
          model: PostSubject,
          as: 'subject',
        },
      ],
    });
    return {
      list: rows,
      total: count,
    };
  }

  async create(addPlatesForm: CreatePostPlatesDto): Promise<PostPlatesDto> {
    const { name, subjectId } = addPlatesForm;
    const subject = await PostSubject.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException('当前专题不存在，请重新尝试');
    }
    const tag = await PostPlate.findOne({
      where: {
        name,
      },
    });

    if (tag) {
      throw new HttpException('板块名称重复', 200);
    }
    return await PostPlate.create({
      ...addPlatesForm,
    });
  }

  async update(updatePlatesForm: UpdatePostPlatesDto): Promise<boolean> {
    const { plateId, ...updateForm } = updatePlatesForm;
    const tag = await PostPlate.findByPk(plateId);
    if (!tag) {
      throw new HttpException('板块不存在', 404);
    }
    const updateState = await PostPlate.update(
      {
        ...updateForm,
      },
      {
        where: {
          plateId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async delete(plateId: number | string): Promise<number> {
    const tag = await PostPlate.findByPk(plateId);

    if (!tag) {
      throw new NotFoundException('板块不存在');
    }
    return await PostPlate.destroy({
      where: {
        plateId,
      },
    });
  }

  async changeState(plateId: number | string): Promise<any> {
    const subject = await PostPlate.findByPk(plateId);

    if (!subject) {
      throw new HttpException('板块不存在', 404);
    }
    const updateState = await PostPlate.update(
      {
        state: subject.getDataValue('state') === 1 ? 2 : 1,
      },
      {
        where: { plateId },
      },
    );

    return updateState[0] > 0;
  }

  async changeSort(changePlateSort: UpdatePostPlatesDto): Promise<boolean> {
    const { plateId, sort } = changePlateSort;
    const tag = await PostPlate.findByPk(plateId);

    if (!tag) {
      throw new HttpException('板块不存在', 404);
    }
    const updateSort = await PostPlate.update(
      {
        sort,
      },
      {
        where: { plateId },
      },
    );

    return updateSort[0] > 0;
  }
}
