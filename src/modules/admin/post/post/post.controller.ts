import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { AdminRouter } from '../../../../decorator/router.decorator';

@AdminRouter('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
}
