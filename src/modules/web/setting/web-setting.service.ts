import { Injectable } from '@nestjs/common';
import { Publicize, WebLinks } from '../../../models/index.model';

@Injectable()
export class WebSettingService {
  // 获取首页的所有设置
  async SettingByIndexPage() {
    // 获取轮播图
    const indexSlides = await Publicize.findAll({
      where: {
        type: 1,
        state: 1,
      },
      order: [['sort', 'asc']],
    });
    // 获取首页右侧推广
    const sidePublicize = await Publicize.findAll({
      where: {
        type: 2,
        state: 1,
      },
      order: [['sort', 'asc']],
    });
    // 获取官方链接列表
    const links = await WebLinks.findAll({
      where: {
        state: 1,
        type: 1,
      },
      order: [['sort', 'asc']],
    });

    return {
      indexSlides,
      sidePublicize,
      links,
    };
  }

  // async getSetting(key:string){
  //   await Setting =
  // }
}
