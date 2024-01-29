interface UserInfo {
  userId: number;
  account: string;
  nickname: string;
  email: string;
  avatar: string;
  desc: string;
  accountId: number;
  isAdmin: boolean;
  createTime: number;
}

export class UserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
