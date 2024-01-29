import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getReqMainInfo } from '../utils/utils';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message &&
          Array.isArray((exception.getResponse() as any).message) &&
          (exception.getResponse() as any).message.length !== 0
          ? (exception.getResponse() as any).message
          : exception.message
        : 'Internal Server Error';
    console.error({ exception });
    const msgLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      msg: message,
      request,
    };

    // 记录日志（错误消息，错误码，请求信息等）
    this.logger.error(message, {
      status,
      req: getReqMainInfo(request),
      // stack: exception.stack,
    });
    response.status(status).json({
      code: -1,
      message,
    });
  }
}
