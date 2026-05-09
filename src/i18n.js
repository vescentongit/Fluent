import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import id from './locales/id.json';
import ms from './locales/ms.json';
import tl from './locales/tl.json';
import vi from './locales/vi.json';
import th from './locales/th.json';
import my from './locales/my.json';
import km from './locales/km.json';
import lo from './locales/lo.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
  ms: { translation: ms },
  tl: { translation: tl },
  vi: { translation: vi },
  th: { translation: th },
  my: { translation: my },
  km: { translation: km },
  lo: { translation: lo }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;