import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

const AES_KEY = '0123456789abcdef'; // 密钥, AES-128 需16个字符, AES-256 需要32个字符
const AES_IV = 'abcdef0123456789'; // 密钥偏移量，16个字符

// const key = CryptoJS.enc.Utf8.parse(AES_KEY);
const iv = CryptoJS.enc.Utf8.parse(AES_IV);

export const makeSalt = () => {
  return crypto.randomBytes(16).toString('base64');
};

export const encryptPassword = (password, salt) => {
  if (!password || !salt) return '';
  return crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
};

// 服务端提供密钥与偏移量
// 'key'       => '0123456789abcdef'
// 'iv'        => 'abcdef0123456789'

// 加密
export function encrypt(data, key) {
  const keys = CryptoJS.enc.Utf8.parse(key);
  const srcs = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(srcs, keys, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
export function decrypt(data, key) {
  const keys = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(data, keys, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted).toString();
}
