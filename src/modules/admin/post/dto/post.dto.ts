import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ListDataDto, ListQueryDto } from '../../../../modules/default.dto';

// Post
export class PostDto {}

export class PostListQueryDto extends ListQueryDto {}

export class PostListDataDto extends ListDataDto<PostDto> {}

export class CreatePostDto {}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

// PostSubject
export class PostSubjectDto {
  @IsNotEmpty({ message: '文章专题名称不能为空' })
  title: string;
  desc: string;
  @IsNotEmpty({ message: '文章专题状态不能为空' })
  state: string | number;
}

export class CreatePostSubjectDto extends PostSubjectDto {
  @IsInt({ message: '排序为数字' })
  sort?: number;
}

export class PostSubjectListDataDto extends ListDataDto<PostSubjectDto> {}

export class UpdatePostSubjectDto extends PartialType(CreatePostSubjectDto) {
  @IsNotEmpty({ message: '专题ID不能为空' })
  subjectId: string | number;
}

// PostPlates
export class PostPlatesDto {
  @IsNotEmpty({ message: '文章板块名称不能为空' })
  name: string;
  desc: string;
  @IsNotEmpty({ message: '板块状态不能为空' })
  state: string | number;
  @IsNotEmpty({ message: '所在专题不能为空' })
  subjectId: string | number;
  sort: number;
}

export class PostPlateListQueryDto extends PartialType(ListQueryDto) {
  subjectId: string | number;
}

export class PostPlateListDataDto extends ListDataDto<PostPlatesDto> {}

export class CreatePostPlatesDto extends PostPlatesDto {}

export class UpdatePostPlatesDto extends PartialType(CreatePostPlatesDto) {
  @IsNotEmpty({ message: '板块ID不能为空' })
  plateId: string | number;
}

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
