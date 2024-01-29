import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), '/upload/file/avatar'));
    } catch (e) {
      // console.log(e,'/file/avatar')
    }

    cb(null, path.join(process.cwd(), '/upload/file/avatar'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '_' +
      Math.round(Math.random() * 1e9) +
      '_' +
      file.originalname;
    cb(null, file.fieldname + '_' + uniqueSuffix);
  },
});

const imgFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'upload/file/image'));
    } catch (e) {}

    cb(null, path.join(process.cwd(), 'upload/file/image'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export { avatarStorage, imgFileStorage };
