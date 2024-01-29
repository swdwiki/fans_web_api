import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ListDataDto, ListQueryDto } from '../../../../modules/default.dto';

// Publicize
export class PublicizeDto {
  @IsNotEmpty({ message: '推广图片链接不能为空' })
  imgUrl: string;
  @IsNotEmpty({ message: '推广类型不能为空' })
  type: number;
  jumpLink: boolean;
  out: boolean;
  desc: string;
  state: number | string;
  startTime: string;
  endTime: string;
}

export class PublicizeQueryDto extends PartialType(ListQueryDto) {
  type: string | number;
}

export class CreatePublicizeDto extends PublicizeDto {
  @IsInt({ message: '排序为数字' })
  sort?: number;
}

export class PublicizeListDataDto extends ListDataDto<PublicizeDto> {}

export class UpdatePublicizeDto extends PartialType(CreatePublicizeDto) {
  @IsNotEmpty({ message: '推广ID不能为空' })
  publicizeId: string | number;
}

// WebLink
export class WebLinkDto {
  @ApiProperty({ name: 'type', enum: [1, 2], type: 'number' })
  @IsNotEmpty({ message: '链接类型不能为空' })
  type: number;
  @ApiProperty({ name: 'title', required: true, type: 'string' })
  @IsNotEmpty({ message: '链接标题不能为空' })
  title: string;
  @ApiProperty({ name: 'avatar', required: false, type: 'string' })
  avatar: string;
  @ApiProperty({ name: 'url', required: true, type: 'string' })
  @IsNotEmpty({ message: '跳转链接地址不能为空' })
  url: string;
  @ApiProperty({ name: 'desc', required: false, type: 'string' })
  desc: string;
  @ApiProperty({
    name: 'state',
    enum: [1, 2],
    required: false,
    type: 'number',
  })
  state: number | string;
}

export class WebLinkQueryDto extends PartialType(ListQueryDto) {
  type: string | number;
}

export class CreateWebLinkDto extends WebLinkDto {
  @ApiProperty({
    name: 'sort',
    required: false,
    type: 'number',
  })
  @IsInt({ message: '排序为数字' })
  sort?: number;
}

export class WebLinkListDataDto extends ListDataDto<WebLinkDto> {}

export class UpdateWebLinkDto extends PartialType(CreateWebLinkDto) {
  @ApiProperty({
    name: 'linkId',
    required: true,
    type: 'number',
  })
  @IsNotEmpty({ message: '链接ID不能为空' })
  linkId: string | number;
}

// // PostPlates
// export class PostPlatesDto {
//   @IsNotEmpty({ message: '文章标签名称不能为空' })
//   name: string;
//   desc: string;
//   @IsNotEmpty({ message: '标签状态不能为空' })
//   state: string | number;
//   @IsNotEmpty({ message: '所在专题不能为空' })
//   subjectId: string | number;
// }

// export class PostPlateListQueryDto extends PartialType(ListQueryDto) {
//   subjectId: string | number;
// }

// export class PostPlateListDataDto extends ListDataDto<PostPlatesDto> {}

// export class CreatePostPlatesDto extends PostPlatesDto {}

// export class UpdatePostPlatesDto extends PartialType(CreatePostPlatesDto) {
//   @IsNotEmpty({ message: '标签ID不能为空' })
//   tagId: string | number;
// }

// // PostTags
// export class PostTagsDto {
//   @IsNotEmpty({ message: '文章标签名称不能为空' })
//   name: string;
//   desc: string;
//   @IsNotEmpty({ message: '标签状态不能为空' })
//   state: string | number;
// }

// export class PostTagListQueryDto extends PartialType(ListQueryDto) {
//   name: string;
// }

// export class PostTagListDataDto extends ListDataDto<PostTagsDto> {}

// export class CreatePostTagsDto extends PostTagsDto {}

// export class UpdatePostTagsDto extends PartialType(CreatePostTagsDto) {
//   @IsNotEmpty({ message: '标签ID不能为空' })
//   tagId: string | number;
// }
