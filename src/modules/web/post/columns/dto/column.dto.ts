import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ListQueryDto, ListDataDto } from '../../../../../modules/default.dto';

export class PostColumnDto {}

export class PostColumnListQueryDto extends ListQueryDto {
  status?: 'published' | 'auditing' | 'injected';
}

export class CreatePostColumnDto {
  @IsNotEmpty({ message: '专栏标题不能为空' })
  name: string;
  cover: string;
  @IsNotEmpty({ message: '专栏介绍不能为空' })
  desc: string;
}

export class PostColumnListDataDto extends ListDataDto<PostColumnDto> {}

export class UpdatePostColumnDto extends PartialType(CreatePostColumnDto) {
  @IsNotEmpty({ message: '专题ID不能为空' })
  columnId: string | number;
  status?: 'published' | 'auditing' | 'injected';
}
