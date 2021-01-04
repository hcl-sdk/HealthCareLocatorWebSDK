// let i18nLabels = {};
import { i18nStore } from '../core/stores'

export async function getI18nLabels(lang: string) {
  try {
    const resp = await fetch(`/i18n/${lang}.json`);
    const i18nLabels = await resp.json();
    i18nStore.setState({ labels: i18nLabels });
  } catch (err) {
    console.log('error loading i18n labels');
  }
}

export const t = i18nStore.translate.bind(i18nStore);

// translate
// export function t(key: string) {
//   if (!i18nLabels[key]) {
//     console.log(`[i18n] missing transation for "${key}"`);
//     return key;
//   }
//   return i18nLabels[key];
// }
