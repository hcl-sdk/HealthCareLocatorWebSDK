import { i18nStore, configStore } from '../core/stores'

export async function getI18nLabels(lang: string) {
  try {
    const path = configStore.state.i18nBundlesPath;
    const resp = await fetch(`${path}/${lang}.json`);
    const i18nLabels = await resp.json();
    i18nStore.setState({ labels: i18nLabels, lang });
  } catch (err) {
    console.log('error loading i18n labels');
  }
}

export const t = i18nStore.translate.bind(i18nStore);
