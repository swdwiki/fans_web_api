import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Publicize, WebLinks } from '../../../models/index.model';
import {
  PublicizeQueryDto,
  CreatePublicizeDto,
  UpdatePublicizeDto,
  WebLinkQueryDto,
  CreateWebLinkDto,
  UpdateWebLinkDto,
} from './dto/web-setting.dto';

@Injectable()
export class WebSettingService {
  // 推广内容模块
  async createPublicize(createPublicizeForm: CreatePublicizeDto) {
    // 创建推广内容
    return await Publicize.create({
      ...createPublicizeForm,
    });
  }

  async publicizeList(publicizeQuery: PublicizeQueryDto) {
    // 获取推广内容列表
    const { pageSize, current, type } = publicizeQuery;
    const where: any = {};
    if (type) {
      where.type = type;
    }
    const { count, rows } = await Publicize.findAndCountAll({
      where,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async publicizeUpdate(updatePublicizeForm: UpdatePublicizeDto) {
    // 更新推广内容
    const { publicizeId, ...updateForm } = updatePublicizeForm;
    const publicize = await Publicize.findByPk(publicizeId);
    if (!publicize) {
      throw new NotFoundException('该推广不存在');
    }
    const updateState = await Publicize.update(
      {
        ...updateForm,
      },
      {
        where: {
          publicizeId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async publicizeDelete(publicizeId: number | string): Promise<number> {
    // 删除推广内容
    if (!publicizeId) {
      throw new HttpException('请选择要删除的推广', 400);
    }
    const publicize = await Publicize.findByPk(publicizeId);
    if (!publicize) {
      throw new NotFoundException('推广不存在');
    }
    return await Publicize.destroy({
      where: {
        publicizeId,
      },
    });
  }

  // 官方+友情链接模块
  async createWebLink(createWebLinkForm: CreateWebLinkDto) {
    // 创建链接内容
    // const {url} = createWebLinkForm;
    return await WebLinks.create({
      ...createWebLinkForm,
    });
  }

  async weblinkList(weblinkQuery: WebLinkQueryDto) {
    // 获取链接列表
    const { pageSize, current, type } = weblinkQuery;
    const where: any = {};
    if (type) {
      where.type = type;
    }
    const { count, rows } = await WebLinks.findAndCountAll({
      where,
      limit: Number(pageSize) || 10,
      offset: Number(pageSize) * (Number(current) - 1) || 0,
      order: [['sort', 'asc']],
    });

    return {
      list: rows,
      total: count,
    };
  }

  async weblinkUpdate(updateWebLinkForm: UpdateWebLinkDto) {
    // 更新链接内容
    const { linkId, ...updateForm } = updateWebLinkForm;
    const weblink = await WebLinks.findByPk(linkId);
    if (!weblink) {
      throw new NotFoundException('该链接不存在');
    }
    const updateState = await WebLinks.update(
      {
        ...updateForm,
      },
      {
        where: {
          linkId,
        },
      },
    );

    return updateState[0] > 0;
  }

  async weblinkDelete(linkId: number | string): Promise<number> {
    // 删除链接内容
    if (!linkId) {
      throw new HttpException('请选择要删除的链接', 400);
    }
    const weblink = await WebLinks.findByPk(linkId);
    if (!weblink) {
      throw new NotFoundException('链接不存在');
    }
    return await WebLinks.destroy({
      where: {
        linkId,
      },
    });
  }
}
