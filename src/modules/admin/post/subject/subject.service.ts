import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PostSubject, PostPlate } from '../../../../models/index.model';
import {
  CreatePostSubjectDto,
  PostSubjectDto,
  UpdatePostSubjectDto,
  PostSubjectListDataDto,
} from '../dto/post.dto';

@Injectable()
export class AdminSubjectService {
  async list(): Promise<PostSubjectListDataDto> {
    const list = await PostSubject.findAll({
      order: [['sort', 'asc']],
      include: [
        {
          model: PostPlate,
          as: 'plates',
          order: [['sort', 'asc']],
        },
      ],
    });

    return {
      list,
    };
  }

  async subject(subjectId): Promise<PostSubjectDto> {
    const subject = await PostSubject.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException('专题不存在');
    }
    return await PostSubject.findOne({
      where: {
        subjectId,
      },
      include: [
        {
          model: PostPlate,
          as: 'plates',
          order: [['sort', 'asc']],
        },
      ],
    });
  }

  async create(addInfo: CreatePostSubjectDto): Promise<PostSubjectDto> {
    const { title } = addInfo;
    const subject = await PostSubject.findOne({
      where: {
        title,
      },
    });

    if (subject) {
      throw new HttpException('专题名称重复', 200);
    }
    return await PostSubject.create({
      ...addInfo,
    });
  }

  async update(updateSubjectForm: UpdatePostSubjectDto): Promise<boolean> {
    const { subjectId, ...info } = updateSubjectForm;
    const subject = await PostSubject.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException('专题不存在');
    }
    const updateState = await PostSubject.update(
      {
        ...info,
      },
      {
        where: {
          subjectId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async delete(subjectId: number | string): Promise<number> {
    if (!subjectId) {
      throw new HttpException('请选择要删除的专题', 400);
    }
    const subject = await PostSubject.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException('专题不存在');
    }
    const plates = await PostPlate.count({
      where: {
        subjectId,
      },
    });
    if (plates > 0) {
      throw new HttpException('请清空该专题下的所有板块后再进行删除操作', 400);
    }
    return await PostSubject.destroy({
      where: {
        subjectId,
      },
    });
  }

  async changeState(subjectId: number | string): Promise<any> {
    const subject = await PostSubject.findByPk(subjectId);

    if (!subject) {
      throw new NotFoundException('专题不存在');
    }
    const updateState = await PostSubject.update(
      {
        state: subject.getDataValue('state') === 1 ? 2 : 1,
      },
      {
        where: { subjectId },
      },
    );

    return updateState[0] > 0;
  }

  async changeSort(changeSubjectSort: {
    subjectId: number | string;
    sort: number;
  }): Promise<boolean> {
    const { subjectId, sort } = changeSubjectSort;
    const subject = await PostSubject.findByPk(subjectId);

    if (!subject) {
      throw new NotFoundException('专题不存在');
    }
    const updateSort = await PostSubject.update(
      {
        sort,
      },
      {
        where: { subjectId },
      },
    );

    return updateSort[0] > 0;
  }
}
