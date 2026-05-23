export default (data) => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(data, 'application/xml');

  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    throw new Error('invalidRss');
  }

  const channel = doc.querySelector('channel');

  const title = channel.querySelector('title').textContent;

  const description = channel.querySelector('description').textContent;

  const items = doc.querySelectorAll('item');

  const posts = [...items].map((item) => ({
    title: item.querySelector('title').textContent,

    description: item.querySelector('description').textContent,

    link: item.querySelector('link').textContent,
  }));

  return {
    feed: {
      title,
      description,
    },

    posts,
  };
};