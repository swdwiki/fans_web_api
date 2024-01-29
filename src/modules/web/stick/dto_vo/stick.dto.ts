import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ListQueryDto } from '../../../../modules/default.dto';

export class createStickClubDto {
  @IsNotEmpty({ message: '圈子名称不能为空' })
  name: string;
  desc?: string;
  state?: number;
  sort?: number;
}

export class updateStickClubDto extends PartialType(createStickClubDto) {
  clubId: number;
}

export class stickClubListDto extends PartialType(ListQueryDto) {
  name?: string;
}

export class createStickThemeDto {
  @IsNotEmpty({ message: '主题名称不能为空' })
  name: string;
  desc?: string;
  state?: number;
  sort?: number;
  notice?: string;
  @IsNotEmpty({ message: '所在圈子不能为空' })
  clubId: number;
  cover: string;
}

export class updateStickThemeDto extends PartialType(createStickThemeDto) {
  themeId: number;
}

export class stickThemeListDto extends PartialType(ListQueryDto) {
  clubId?: number;
  name?: string;
}

export class stickListDto extends PartialType(ListQueryDto) {
  themeId?: number;
  content?: string;
}

export class createStickDto {
  @IsNotEmpty({ message: '尺牍内容不能为空' })
  content: string;
  imgList?: Array<any>;
  status?: number;
  themeId?: number;
  link?: string;
}

export class stickCommentDto {
  stickId: number;
  content: string;
  images?: string;
}

export class stickCommentReplyDto extends stickCommentDto {
  receiverId?: number;
  commentId: number;
}

export class commentReplyQueryDto extends ListQueryDto {
  commentId: number;
}
