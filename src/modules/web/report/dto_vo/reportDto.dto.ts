export class createReportFormDto {
  reasonId: number;
  type: string;
  content: string;
  imgFilesUrl: Array<any>;
  //   作品
  postId?: number;
  stickId?: number;
  workId?: number;
  //   评论
  stickCommentId?: number;
  postCommentId?: number;
  workCommentId?: number;
  //   回复
  stickCommentReplyId?: number;
  postCommentReplyId?: number;
  workCommentReplyId?: number;
}
