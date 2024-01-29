import { Account } from './default/account.model';
import { AccountUser } from './user/user.model';
import { LoginLog } from './user/loginLog.model';
import { Posts } from './post/post.model';
import { PostPlateRecord } from './post/PostPlatesRecord.model';
import { PostSubject } from './post/PostSubject.model';
import { PostPlate } from './post/PostPlates.model';
import { PostHistory } from './post/PostHistory.model';
import { AdminRoles } from './admin/adminRole.model';
import { BanTypes } from './user/ban/banType.model';
import { Tags } from './post/Tags.model';
import { PostTagRecord } from './post/PostTagsRecord.model';
import { Publicize } from './web/Publicize.model';
import { WebLinks } from './web/link.model';
import { WebSetting } from './default/setting.model';
import { regInvitCode } from './default/regInvitCode.model';
import { UserBlackRoom } from './user/ban/userBlackList.model';
import { PostColumns } from './post/column.model';
import { PostColumnRecord } from './post/columnRecord.model';
import { PostComments } from './post/PostComment.model';
import { PostCommentsReply } from './post/PostCommentReply.model';
import { ExpFireTypes } from './default/expFireType.model';
import { StickThemes } from './stick/theme.model';
import { StickClubs } from './stick/club.model';
import { Sticks } from './stick/stick.model';
import { StickLikeRecord } from './stick/like.model';
import { StickComments } from './stick/comment.model';
import { StickCommentsReply } from './stick/reply.model';
import { Reports } from './default/report.model';
import { FollowRecord } from './default/follow.model';
import { PostLikeRecord } from './post/like.model';
import { PostReadRecord } from './post/readRecord.model';
import { SigninRecord } from './default/signinRecord.model';
import { SigninCard } from './default/signinCard.model';
import { Levels } from './default/level.model';
import { ExpRecord } from './default/expRecord.model';
import { FireRecord } from './default/fireRecord.model';
import { DailyLines } from './default/dailyLines.model';
// import StickModels from './stick/index.model';

// const allModels = {};
// for (const key in StickModels) {
//   if (Object.prototype.hasOwnProperty.call(StickModels, key)) {
//     const element = StickModels[key];
//     allModels[key] = element;
//   }
// }

export {
  PostSubject,
  Account,
  AccountUser,
  LoginLog,
  PostPlate,
  Posts,
  PostPlateRecord,
  PostHistory,
  AdminRoles,
  BanTypes,
  Tags,
  PostTagRecord,
  Publicize,
  WebLinks,
  WebSetting,
  regInvitCode,
  UserBlackRoom,
  PostColumns,
  PostColumnRecord,
  PostComments,
  StickClubs,
  StickThemes,
  Sticks,
  StickLikeRecord,
  StickComments,
  StickCommentsReply,
  Reports,
  FollowRecord,
  PostCommentsReply,
  PostLikeRecord,
  PostReadRecord,
  SigninRecord,
  SigninCard,
  Levels,
  ExpRecord,
  FireRecord,
  ExpFireTypes,
  DailyLines,
};
