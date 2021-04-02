import { i18nStore, configStore } from '../core/stores'
import messagesEn from '../i18n/en_us.json';

const mapFilenameByLang = {
  'en': 'en_us',
  'fr': 'fr_fr'
}

function getLangJsonFileName(lang: string) {
  const langSanitize = lang.toLowerCase().replace(new RegExp('-', 'ig'), '_');
  const fileName = mapFilenameByLang[langSanitize] || langSanitize;
  return `${fileName}.json`;
}

export async function getI18nLabels(lang: string) {
  try {
    const path = configStore.state.i18nBundlesPath;
    const jsonFileName = getLangJsonFileName(lang);
    const resp = await fetch(`${path}/${jsonFileName}`);
    const i18nLabels = await resp.json();
    i18nStore.setState({ labels: i18nLabels, lang });
  } catch (err) {
    i18nStore.setState({ labels: messagesEn, lang: 'en' });
  }
}

export const t = i18nStore.translate.bind(i18nStore);
