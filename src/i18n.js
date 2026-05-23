import i18next from 'i18next';

import ru from './locales/ru';

export default () => {
  const i18n = i18next.createInstance();

  return i18n.init({
    lng: 'ru',

    resources: {
      ru: ru,
    },
  }).then(() => i18n);
};