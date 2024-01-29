import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getReqMainInfo } from '../utils/utils';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log(context.getArgs());
    const ctx = context.switchToHttp();
    // const info = context.getArgByIndex(0);
    const req = ctx.getRequest<Request>();
    // console.log(info.header('Authorization'));
    // // console.log(info['url']);
    // // console.log(info.)
    // // console.log(info.method)
    // // console.log(info.params)
    // // console.log(info.query)
    // // console.log(info.body)

    // // Object.keys(info).forEach((key) => {
    // //   console.log(key);
    // // });

    return next.handle().pipe(
      map((data) => {
        this.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(req),
        });
        return {
          data,
          code: 0,
          msg: 'ok',
        };
      }),
    );
  }
}
