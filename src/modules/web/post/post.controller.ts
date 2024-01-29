import {
  Query,
  Get,
  Post,
  Req,
  Body,
  Request,
  Headers,
  Delete,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  PostListQueryDto,
  addPostFormDto,
  PostCommentFormDto,
  PostCommentQueryDto,
  PostReplyFormDto,
  PostReplyQueryDto,
  updatePostFormDto,
  changePostStatusFormDto,
} from './post.dto';
import { WebRouter } from '../../../decorator/router.decorator';
import { Public } from '../../../decorator/default.decorator';
import { Request as ExpRequest } from 'express';

@WebRouter('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 用户在首页上看到的文章列表
  @Public()
  @Get('index/list')
  getIndexPostList(@Query() postListQuery: PostListQueryDto, @Req() req) {
    if (req.user) {
      return this.postService.getIndexPostList(postListQuery, req.user.userId);
    } else {
      return this.postService.getIndexPostList(postListQuery);
    }
  }

  @Post('add')
  createPost(@Body() addPostForm: addPostFormDto, @Req() req) {
    return this.postService.createPost(addPostForm, req.user);
  }

  @Post('update')
  updatePost(@Body() updatePostForm: updatePostFormDto, @Req() req) {
    const { userId } = req.user;
    return this.postService.updatePost(updatePostForm, userId);
  }

  @Post('change/status')
  changeStatus(
    @Body() changePostStatusForm: changePostStatusFormDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    return this.postService.updatePostStatus(changePostStatusForm, userId);
  }

  @Delete('remove/:postId')
  deletePost(@Param('postId') postId, @Req() req) {
    const { userId } = req.user;
    return this.postService.deletePost(postId, userId);
  }

  // 用户自己的文章列表
  @Get('creator/list')
  getCreatorPostList(@Query() postListQuery: PostListQueryDto, @Req() req) {
    return this.postService.getCreatorPostList(postListQuery, req.user);
  }

  // 专栏下文章
  @Public()
  @Get('list/bycolumn')
  getColumnPostList(@Query() postListQuery: PostListQueryDto, @Req() req) {
    if (req.user) {
      return this.postService.getColumnPostList(postListQuery, req.user.userId);
    } else {
      return this.postService.getColumnPostList(postListQuery);
    }
  }

  @Public()
  @Get('detail')
  getPostDetailPageData(
    @Query('postId') postId: number | string,
    @Req() req,
    @Request() request: ExpRequest,
    @Headers() headers: any,
  ) {
    const ipAddress =
      headers['X-Forwarded-For'] || headers['X-Real-IP'] || request.ip;
    if (req.user) {
      const { userId } = req.user;
      return this.postService.getPostDetailPageData(postId, ipAddress, userId);
    } else {
      return this.postService.getPostDetailPageData(postId, ipAddress);
    }
  }

  @Get('creator/detail')
  getPostDetailByCreator(@Query('postId') postId: number | string, @Req() req) {
    const { userId } = req.user;
    return this.postService.getPostDetailByUpdate(postId, userId);
  }

  @Post('comment/send')
  sendComment(@Body() commentForm: PostCommentFormDto, @Req() req) {
    return this.postService.sendComment(commentForm, req.user.userId);
  }

  @Post('reply')
  sendReply(@Body() replyForm: PostReplyFormDto, @Req() req) {
    const { userId } = req.user;
    return this.postService.sendReply(replyForm, userId);
  }

  @Post('like')
  likePost(@Body('postId') postId: number, @Req() req) {
    const { userId } = req.user;
    return this.postService.likePost(postId, userId);
  }

  @Public()
  @Get('comment/list')
  getCommentList(
    @Query()
    commentQuery: PostCommentQueryDto,
  ) {
    return this.postService.getCommentList(commentQuery);
  }

  @Public()
  @Get('reply/list')
  getReplyList(
    @Query()
    commentQuery: PostReplyQueryDto,
  ) {
    return this.postService.getReplyList(commentQuery);
  }

  // // 用户查看别人的已审核通过的文章列表
  // @Get('list/:id')
  // getUserPostList(@Query() postListQuery: PostListQueryDto) {
  //   return this.postService.getUserPostList(postListQuery);
  // }

  // @Post('list')
  // getPostList(@Body() addPostForm: CreatePostDto) {
  //   return this.postService.create(postListQuery);
  // }
}
