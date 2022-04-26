import { formatDistance as formatDistanceFns } from 'date-fns';
import { enUS, frCA, fr, enGB, es, it, pl, pt, ru, tr, arSA, arMA, nl, de, } from 'date-fns/locale'

export const dateUtils = (date: Date | number) => ({
  diffMinuteFromNow() {
    const previous = +date;
    const now = Date.now();
    return (now - previous) / (1000 * 60);
  }
})

const mapLocal = {
  'fr': fr,
  'fr_fr': fr,
  'fr_ca': frCA,
  'en': enUS,
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

const selectLocale = (localeStr?: string): Locale => {
  return mapLocal[String(localeStr).toLowerCase()] || enUS
}

export const formatDistance = (date: Date | number, localeStr?: string) => {
  return formatDistanceFns(date, Date.now(), {
    locale: selectLocale(localeStr)
  })
}

export const localizeDay =(day, localeStr?: string) => {
  return ((selectLocale(localeStr))).localize.day(day, {
    width: 'abbreviated',
    context: 'formatting',
  });
}

export const WeekDayToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};