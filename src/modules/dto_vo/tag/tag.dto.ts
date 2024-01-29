import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ListDataDto, ListQueryDto } from '../../default.dto';

// Tags
export class TagsDto {
  @IsNotEmpty({ message: '标签名称不能为空' })
  name: string;
  desc: string;
  @IsNotEmpty({ message: '板块状态不能为空' })
  state: string | number;
}

export class TagListQueryDto extends PartialType(ListQueryDto) {
  name: string;
}

export class TagListDataDto extends ListDataDto<TagsDto> {}

export class CreateTagsDto extends TagsDto {}

export class UpdateTagsDto extends PartialType(CreateTagsDto) {
  @IsNotEmpty({ message: '板块ID不能为空' })
  tagId: string | number;
}
