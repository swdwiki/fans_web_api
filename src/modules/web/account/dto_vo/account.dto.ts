import { IsInt, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterAccountDto {
  @IsNotEmpty({ message: '账号不能为空' })
  account: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '账号不能为空' })
  @IsEmail({}, { message: '请输入正确的邮箱格式' })
  email: string;

  nickname?: string;

  code?: string;

  invitCode?: string;

  regType?: 'code' | 'default';
}

export class LoginAccountDto {
  @IsNotEmpty({ message: '账号不能为空' })
  account: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class changeMailDto {
  @IsNotEmpty({ message: '原邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  code: string;

  @IsNotEmpty({ message: '新邮箱不能为空' })
  newemail: string;
}

export class changePswDto {
  @IsNotEmpty({ message: '验证邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  code: string;

  @IsNotEmpty({ message: '原密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  newpass: string;
}

export class changeProfileDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;
  short: string;
  desc: string;
}

export class updateAvatarDto {
  @IsNotEmpty({ message: '头像不能为空' })
  avatar: string;
}
