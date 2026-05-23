import axios from 'axios';

const getProxyUrl = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');

  proxy.searchParams.set('disableCache', 'true');

  proxy.searchParams.set('url', url);

  return proxy.toString();
};

export default (url) => axios
  .get(getProxyUrl(url))
  .then((response) => {
    if (!response.data.contents) {
      throw new Error('networkError');
    }

    return response;
  });