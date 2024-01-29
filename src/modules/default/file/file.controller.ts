import {
  Post,
  UseInterceptors,
  MaxFileSizeValidator,
  HttpException,
  ParseFilePipe,
  UploadedFile,
  FileTypeValidator,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { avatarStorage, imgFileStorage } from './storage';
import { FileSizeValidator } from './FileValidator';
import { defaultConfig } from '../../../config/default.config';
import { DefaultRouter } from '../../../decorator/router.decorator';

@DefaultRouter('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: avatarStorage,
    }),
  )
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: (err: string) => {
          throw new BadRequestException(`上传失败 ${err}`);
        },
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileSizeValidator({}),
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { mimetype, size, filename } = file;
    // 增加文件上传登记功能，需要拆解对应用户的token，然后确定是admin上传还是user上传，然后存入数据库，确定数据库
    // const  =
    // Files.create()
    return {
      url: defaultConfig.baseUrl + '/file/avatar/' + filename,
      filename,
      size,
      mimetype,
    };
  }

  @Post('upload/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imgFileStorage,
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: (err: string) => {
          // console.log(err);
          throw new BadRequestException(`上传失败 ${err}`);
        },
        validators: [
          new FileSizeValidator({}),
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { mimetype, size, filename } = file;
    return {
      url: defaultConfig.baseUrl + '/file/image/' + filename,
      name: filename,
      size,
      mimetype,
    };
  }

  @Post('upload/files')
  @UseInterceptors(FileInterceptor('files'))
  uploadFiles(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: (err) => {
          // console.log(err);
          throw new HttpException('上传失败', 404);
        },
        validators: [
          new FileSizeValidator({}),
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    // const { mimetype, size, filename } = files;
    // return {
    //   url: defaultConfig.baseUrl + '/file/image/' + filename,
    //   name: filename,
    //   size,
    //   mimetype,
    // };
  }
}
