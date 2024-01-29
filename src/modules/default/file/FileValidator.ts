import { FileValidator, HttpException } from '@nestjs/common';

export class FileSizeValidator extends FileValidator {
  constructor(options) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (file.size > 5242880) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    throw new HttpException(`文件 ${file.originalname} 大小超出 5M`, 400);
    return `文件 ${file.originalname} 大小超出 10k`;
  }
}

// export class FileTypeValidator extends FileValidator {
//     constructor(options) {
//       super(options);
//     }

//     isValid(file: Express.Multer.File): boolean | Promise<boolean> {
//       if (file.size > 10000) {
//         return false;
//       }
//       return true;
//     }
//     buildErrorMessage(file: Express.Multer.File): string {
//       return `文件 ${file.originalname} 大小超出 10k`;
//     }
//   }

// export class DbFileValidator extends FileValidator {
//   constructor(options) {
//     super(options);
//   }

//   isValid(file: Express.Multer.File): boolean | Promise<boolean> {
//     if (file.size > 10000) {
//       return false;
//     }
//     return true;
//   }
//   buildErrorMessage(file: Express.Multer.File): string {
//     return `文件 ${file.originalname} 大小超出 10k`;
//   }
// }

// export class TokenFileValidator extends FileValidator {
//   constructor(options) {
//     super(options);
//   }

//   isValid(file: Express.Multer.File): boolean | Promise<boolean> {
//     if (file.size > 10000) {
//       return false;
//     }
//     return true;
//   }
//   buildErrorMessage(file: Express.Multer.File): string {
//     return `文件 ${file.originalname} 大小超出 10k`;
//   }
// }
