import { formatDistance as formatDistanceFns } from 'date-fns';
import { enUS, frCA, fr, enGB } from 'date-fns/locale'

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
    'en_gb': enGB
  }

  return formatDistanceFns(date, Date.now(), {
    locale: mapLocal[String(localeStr).toLowerCase()]
  })
}