import { Get, Post, Body, Delete, Query } from '@nestjs/common';
import { WebSettingService } from './web-setting.service';
import {
  CreatePublicizeDto,
  CreateWebLinkDto,
  PublicizeQueryDto,
  UpdatePublicizeDto,
  UpdateWebLinkDto,
  WebLinkQueryDto,
} from './dto/web-setting.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminRouter } from '../../../decorator/router.decorator';

@AdminRouter('websetting')
export class WebSettingController {
  constructor(private readonly webSettingService: WebSettingService) {}

  // 推广
  @ApiTags('管理端-推广投放')
  @Post('/publicize/create')
  createPublicize(@Body() createPublicizeForm: CreatePublicizeDto) {
    return this.webSettingService.createPublicize(createPublicizeForm);
  }

  @ApiTags('管理端-推广投放')
  @Get('/publicize/list')
  publicizeList(@Query() publicizeQuery: PublicizeQueryDto) {
    return this.webSettingService.publicizeList(publicizeQuery);
  }

  @ApiTags('管理端-推广投放')
  @Post('/publicize/update')
  publicizeUpdate(@Body() updatePublicizeForm: UpdatePublicizeDto) {
    return this.webSettingService.publicizeUpdate(updatePublicizeForm);
  }

  @ApiTags('管理端-推广投放')
  @Delete('/publicize/delete')
  publicizeRemove(@Query('publicizeId') publicizeId: number | string) {
    return this.webSettingService.publicizeDelete(+publicizeId);
  }

  // 链接
  @ApiTags('管理端-网站链接管理')
  @ApiBody({
    type: CreateWebLinkDto,
  })
  @Post('/weblink/create')
  createWebLink(@Body() createWebLinkForm: CreateWebLinkDto) {
    return this.webSettingService.createWebLink(createWebLinkForm);
  }

  @ApiTags('管理端-网站链接管理')
  @Get('/weblink/list')
  WebLinkList(@Body() webLinkQuery: WebLinkQueryDto) {
    return this.webSettingService.weblinkList(webLinkQuery);
  }

  @ApiTags('管理端-网站链接管理')
  @Post('/weblink/update')
  WebLinkUpdate(@Body() updateWebLinkForm: UpdateWebLinkDto) {
    return this.webSettingService.weblinkUpdate(updateWebLinkForm);
  }

  @ApiTags('管理端-网站链接管理')
  @Delete('/weblink/delete')
  WebLinkRemove(@Body('linkId') linkId: number | string) {
    return this.webSettingService.weblinkDelete(+linkId);
  }
}
