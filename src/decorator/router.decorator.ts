import { SetMetadata, Controller } from '@nestjs/common';

export const AdminRouter = (router: string) => {
  return Controller('/admin/' + router);
};

export const DefaultRouter = (router: string) => {
  return Controller('/default/' + router);
};

export const WebRouter = (router: string) => {
  return Controller('/web/' + router);
};
