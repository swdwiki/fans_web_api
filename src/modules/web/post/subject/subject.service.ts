import { Injectable } from '@nestjs/common';
import { PostSubject, PostPlate } from '../../../../models/index.model';

@Injectable()
export class WebSubjectService {
  async list(): Promise<any> {
    return await PostSubject.findAll({
      where: {
        state: 1,
      },
      order: [
        ['sort', 'asc'],
        ['plates', 'sort', 'asc'],
      ],
      attributes: {
        exclude: ['deletedAt', 'updatedAt', 'createdAt'],
      },
      include: [
        {
          model: PostPlate,
          as: 'plates',
          required: false,
          attributes: {
            exclude: ['deletedAt', 'updatedAt', 'createdAt'],
          },
        },
      ],
    });
  }
}
