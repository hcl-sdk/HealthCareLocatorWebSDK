import { formatDistance as formatDistanceFns } from 'date-fns';
import { enUS, frCA, fr, enGB, es, it, pl, pt, ru, tr, arSA, arMA, nl, de } from 'date-fns/locale'

export const dateUtils = (date: Date | number) => ({
  diffMinuteFromNow() {
    const previous = +date;
    const now = Date.now();
    return (now - previous) / (1000 * 60);
  }
})

export const formatDistance = (date: Date | number, localeStr?: string) => {
  const mapLocal = {
    'fr': fr,
    'fr_fr': fr,
    'fr_ca': frCA,
    'en_us': enUS,
    'en_gb': enGB,
    'es_co': es,
    'es_es': es,
    'it_it': it,
    'pl_pl': pl,
    'pt_pt': pt,
    'ru_ru': ru,
    'tr_tr': tr,
    'ar_sa': arSA,
    'ar_ma': arMA,
    'nl_nl': nl,
    'de_de': de
  }

  return formatDistanceFns(date, Date.now(), {
    locale: mapLocal[String(localeStr).toLowerCase()] || enUS
  })
}