import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ADMIN_KEY = 'isAdmin';
export const IS_BAN_KEY = 'isBan';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Ban = () => SetMetadata(IS_BAN_KEY, true);
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);
