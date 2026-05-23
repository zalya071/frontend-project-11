import * as yup from 'yup';

export default (url, feeds) => {
  const urls = feeds.map((feed) => feed.url);

  const schema = yup.string()
    .required('required')
    .url('invalidUrl')
    .notOneOf(urls, 'duplicate');

  return schema.validate(url);
};