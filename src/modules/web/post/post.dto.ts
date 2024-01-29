import { PartialType } from '@nestjs/mapped-types';
import { ListQueryDto } from '../../default.dto';
import { IsNotEmpty } from 'class-validator';

export class PostsDto {}

export class PostListQueryDto extends ListQueryDto {
  title?: string;
  subjectId?: number;
  plateId?: number;
  status?: number;
}

export class addPostFormDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;
  @IsNotEmpty({ message: '文章简介不能为空' })
  desc: string;
  cover: string;
  @IsNotEmpty({ message: '文章分类不能为空' })
  subjectId: number;
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;
  @IsNotEmpty({ message: '文章板块不能为空' })
  plateId: number;
  editorType: 'markdown' | 'rich';
  markdownConfig?: {
    theme: string;
  };
  tags: Array<string>;
  columnId?: number;
  activityId?: number;
}

// export class updatePostFormDto extends addPostFormDto {
//   @IsNotEmpty({ message: '文章ID不能为空' })
//   postId: number;
// }

export class updatePostFormDto extends PartialType(addPostFormDto) {
  postId: number;
}

export class PostCommentFormDto {
  @IsNotEmpty({ message: '请选择要回复的文章' })
  postId: number;
  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string;
  images?: string;
}

export class PostCommentQueryDto extends ListQueryDto {
  postId: number;
}

export class PostReplyQueryDto extends ListQueryDto {
  commentId: number;
}

export class changePostStatusFormDto {
  status: number;
  postId: number;
}

export class PostReplyFormDto {
  postId: number;
  commentId: number;
  content: string;
  images?: Array<any>;
  commentTime?: Date;
  receiverId: number;
}
