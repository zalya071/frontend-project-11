import { uniqueId } from 'lodash';

import request from './request';
import parse from './parser';

const timeout = 5000;

const updateFeeds = (state) => {
  const promises = state.feeds.map((feed) => (
    request(feed.url)

      .then((response) => {
        const { posts } = parse(response.data.contents);

        const currentLinks = state.posts.map((post) => post.link);

        const newPosts = posts.filter(
          (post) => !currentLinks.includes(post.link),
        );

        newPosts.forEach((post) => {
          state.posts.unshift({
            id: uniqueId(),
            ...post,
          });
        });
      })

      .catch(() => {})
  ));

  Promise.all(promises)

    .finally(() => {
      setTimeout(() => updateFeeds(state), timeout);
    });
};

export default updateFeeds;