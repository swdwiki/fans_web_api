import { Request } from 'express';

export function getCode(count) {
  const codeArr = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
  ];
  const resultCodeArr = [];
  const num = count || 8;
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * codeArr.length);
    resultCodeArr[i] = codeArr[random];
  }
  return resultCodeArr.join('');
}

export const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method, body, connection } = req;

  // 获取 IP
  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const { remoteAddress } = connection || {};
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

  return {
    url,
    host: headers.host,
    ip,
    method,
    query,
    body,
    Authorization: req.header('Authorization'),
  };
};
