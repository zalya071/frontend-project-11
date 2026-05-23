import { subscribe } from 'valtio/vanilla';

const renderFeeds = (container, feeds) => {
  container.innerHTML = '';

  if (feeds.length === 0) {
    return;
  }

  const card = document.createElement('div');
  card.classList.add('card');

  const body = document.createElement('div');
  body.classList.add('card-body');

  const title = document.createElement('h2');
  title.textContent = 'Фиды';

  body.append(title);
  card.append(body);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');

    const titleElement = document.createElement('h3');
    titleElement.textContent = feed.title;

    const description = document.createElement('p');
    description.textContent = feed.description;

    item.append(titleElement);
    item.append(description);
    list.append(item);
  });

  card.append(list);
  container.append(card);
};

const renderPosts = (container, posts, state) => {
  container.innerHTML = '';

  if (posts.length === 0) {
    return;
  }

  const card = document.createElement('div');
  card.classList.add('card');

  const body = document.createElement('div');
  body.classList.add('card-body');

  const title = document.createElement('h2');
  title.textContent = 'Посты';

  body.append(title);
  card.append(body);

  const list = document.createElement('ul');
  list.classList.add('list-group');

  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    );

    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (state.ui.viewedPosts.includes(post.id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = 'Просмотр';
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.dataset.id = post.id;

    item.append(link);
    item.append(button);
    list.append(item);
  });

  card.append(list);
  container.append(card);
};

const renderForm = (elements, state, i18n) => {
  const { input, feedback } = elements;

  if (state.form.status === 'filling') {
    input.classList.remove('is-invalid');

    feedback.textContent = '';
    feedback.classList.remove('text-danger', 'text-success');

    return;
  }

  if (state.form.status === 'success') {
    input.classList.remove('is-invalid');

    feedback.textContent = i18n.t('success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');

    return;
  }

  input.classList.add('is-invalid');

  feedback.textContent = i18n.t(`errors.${state.form.error}`);
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
};

export default (elements, state, i18n) => {
  subscribe(state, () => {
    renderForm(elements, state, i18n);
    renderFeeds(elements.feeds, state.feeds);
    renderPosts(elements.posts, state.posts, state);
  });
};
