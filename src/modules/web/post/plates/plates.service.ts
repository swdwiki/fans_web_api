import { Injectable } from '@nestjs/common';
import { PostPlate } from '../../../../models/index.model';

@Injectable()
export class WebPlatesService {
  async list(): Promise<any> {
    return await PostPlate.findAll({
      where: {
        state: 1,
      },
    });
  }
}
