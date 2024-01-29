import { defaultConfig } from '../../config/default.config';

const stripUrl = (url: string) => {
  if (!url) {
    return url;
  }
  if (url.startsWith('/')) {
    return url;
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    return new URL(url).pathname;
  } else {
    throw new Error(`stripUrl: wrong url: ${url}`);
  }
};

const fulfillUrl = (url: string) => {
  if (!url) {
    return url;
  }
  if (url.startsWith('/')) {
    return defaultConfig.baseUrl + url;
  } else if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  } else {
    throw new Error(`fulfillUrl: wrong url: ${url}`);
  }
};

export { stripUrl, fulfillUrl };
