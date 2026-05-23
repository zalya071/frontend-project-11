import { proxy } from 'valtio/vanilla';
import { uniqueId } from 'lodash';

import view from './view';
import validate from './validate';
import getInitialState from './state';
import initI18n from './i18n';
import request from './request';
import parse from './parser';
import updateFeeds from './updateFeeds';

export default () => {
  initI18n().then((i18n) => {
    const state = proxy(getInitialState());

    const form = document.querySelector('.rss-form');
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');

    const elements = {
      input,
      feedback,
      feeds,
      posts,
    };

    view(elements, state, i18n);

    posts.addEventListener('click', (e) => {
      const { id } = e.target.dataset;

      if (!id) {
        return;
      }

      const post = state.posts.find((item) => item.id === id);

      if (!state.ui.viewedPosts.includes(id)) {
        state.ui.viewedPosts.push(id);
      }

      const modal = document.querySelector('#modal');

      modal.querySelector('.modal-title').textContent = post.title;
      modal.querySelector('.modal-body p').textContent = post.description;
      modal.querySelector('.full-article').href = post.link;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const url = formData.get('url');

      validate(url, state.feeds)
        .then(() => request(url))
        .then((response) => {
          const { feed, posts: loadedPosts } = parse(response.data.contents);

          state.feeds.push({
            id: uniqueId(),
            url,
            ...feed,
          });

          loadedPosts.forEach((post) => {
            state.posts.push({
              id: uniqueId(),
              ...post,
            });
          });

          state.form.status = 'success';
          state.form.error = null;

          form.reset();
          input.focus();

          if (state.feeds.length === 1) {
            updateFeeds(state);
          }
        })
        .catch((error) => {
          state.form.status = 'failed';

          if (
            error.isAxiosError
            || error.message === 'networkError'
          ) {
            state.form.error = 'networkError';
          } else {
            state.form.error = error.message;
          }
        });
    });
  });
};
