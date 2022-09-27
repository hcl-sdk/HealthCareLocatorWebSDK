import { DARK_THEME_PROPERTIES, DEFAULT_THEME_PROPERTIES } from '../../../hcl-sdk-core';
import { ActivitiesQuery, Activity, ActivitySortScope, KeyedString, SuggestionsQuery, Url } from '../../../hcl-sdk-core/src/graphql/types';
import { BREAKPOINT_MAX_WIDTH, GEOLOC } from '../core/constants';
import { configStore } from '../core/stores';
import { DistanceUnit } from '../core/stores/ConfigStore';
import { SearchSpecialty, SortValue } from '../core/stores/SearchMapStore';
import { Breakpoint, GeolocCoordinates, ScreenSize } from '../core/types';
import { t } from '../utils/i18n';

const CONTAINER_ELEMENT = 'hcl-sdk';

export function selectSDKElement() {
  return document.querySelector(CONTAINER_ELEMENT);
}

export function getCssColor(colorStyle) {
  return getComputedStyle(document.querySelector(CONTAINER_ELEMENT).shadowRoot.host).getPropertyValue(colorStyle);
}

export function getContainerHeightWidthOffset(currentEl) {
  const elm = currentEl.closest('.wrapper') || document.querySelector(CONTAINER_ELEMENT)

  return {
    offsetWidth: elm?.offsetWidth || 0,
    offsetHeight: elm?.offsetHeight || 0,
  };
}

export function getDoctorCardOffset(cardListItem, selectedMarkerIdx, isVertical = false, isCentered = false, element) {
  const { offsetWidth, offsetHeight } = getContainerHeightWidthOffset(element);
  let offsetSize = offsetWidth
  let offsetName = 'offsetWidth'
  let itemNewOffset = 0

  if(isVertical) {
    offsetSize = offsetHeight
    offsetName = 'offsetTop'
    const cardItemOffset = cardListItem?.children?.[1]?.children?.[selectedMarkerIdx]?.[offsetName] || 0
    const gap = offsetSize / 2;
    itemNewOffset = isCentered ? cardItemOffset - (gap - 100) : cardItemOffset;
  } else {
    const cardItemOffset = cardListItem?.children?.[selectedMarkerIdx]?.[offsetName];
    const gap = (offsetSize - cardItemOffset) / 2;
    itemNewOffset = cardItemOffset * selectedMarkerIdx - (gap - 5);
  }

  return itemNewOffset;
}

export function applyDefaultTheme(darkMode?: boolean) {
  if (document.getElementById('__hclsdk-defaults')) {
    return;
  }
  const styleElement = document.createElement('style');
  const themeProperties = darkMode ? DARK_THEME_PROPERTIES : DEFAULT_THEME_PROPERTIES
  styleElement.id = '__hclsdk-defaults';
  styleElement.innerHTML = `hcl-sdk {\n`;
  for (const prop of Object.keys(themeProperties)) {
    const value = themeProperties[prop];
    styleElement.innerHTML += `  ${prop}: ${value};\n`;
  }
  styleElement.innerHTML += `\n}`;
  document.head.prepend(styleElement);
}

export function getSpecialtiesText(specialties: any[]) {
  return specialties.filter(elm => elm.label).map(elm => elm.label)
}

export function getSpecialties(specialties: KeyedString[]): SearchSpecialty[] {
  return specialties.filter(elm => elm.label && elm.code).map(elm => ({
    id: elm.code,
    name: elm.label,
  }))
}

export function getBreakpointFromParentClientRect(clientRect: DOMRect): Breakpoint {
  const orientation = clientRect.width >= clientRect.height ? 'landscape' : 'portrait';
  let screenSize: ScreenSize = 'unknown';
  if (orientation === 'landscape') {
    if (clientRect.width < BREAKPOINT_MAX_WIDTH.MOBILE_LANDSCAPE) {
      screenSize = 'mobile';
    } else if (clientRect.width < BREAKPOINT_MAX_WIDTH.TABLET_LANDSCAPE) {
      screenSize = 'tablet';
    } else {
      screenSize = 'desktop';
    }
  } else {
    if (clientRect.width < BREAKPOINT_MAX_WIDTH.MOBILE_PORTRAIT) {
      screenSize = 'mobile';
    } else if (clientRect.width < BREAKPOINT_MAX_WIDTH.TABLET_PORTRAIT) {
      screenSize = 'tablet';
    } else {
      screenSize = 'desktop';
    }
  }
  return {
    screenWidth: clientRect.width,
    screenSize,
    orientation
  };
}

export function getMergeMainAndOtherActivities(mainActivity: Activity, otherActivities: Activity[] = []) {
  let results: Activity[];
  if (mainActivity) {
    results = [mainActivity].concat(otherActivities);
  } else {
    results = otherActivities;
  }
  
  results = results.filter(o => o.id).sort((a, b) => {
    const textA = a.workplace.address.longLabel + a.id
    const textB = b.workplace.address.longLabel + a.id
    return (textA).localeCompare(textB);
  });
  return results
}

export function getPrimaryAddressIndividual({ addressName, addressBuildingName, address, postalCode, city }) {
  const cityWithCode = postalCode && city ? `, ${postalCode} ${city}` : ''
  const addressWithCode = address + cityWithCode
  return [addressName, addressBuildingName, addressWithCode].filter(s => s);
}

export function getTextBodyToShare(individualDetail, {
  newLine = '%0D%0A',
  appName = '',
  appURL = '',
  isBoldFirstLine = false
} = {}) {

  const { name, phone, professionalType, specialties } = individualDetail;
  const specialtiesText = getSpecialtiesText(specialties).join(',')
  const listText = [
    isBoldFirstLine ? `<b>${t('share_hcp_description')}</b>` : t('share_hcp_description'),
    `${name}${professionalType && (newLine + professionalType)}`,
    specialtiesText ? `${t('share_hcp_specialties')} ${specialtiesText}` : '',
    `${getPrimaryAddressIndividual(individualDetail).join(newLine)}`,
    phone
  ].filter(txt => txt)

  if (appName) {
    let appText = t('share_hcp_found_text').replace('{name}', appName);
    if (appURL) {
      appText += ` - ${appURL}`;
    }
    listText.push(appText);
  }

  return listText.join(`${newLine}${newLine}`);
}

export function fallbackShareHCPDetail(individualDetail, config) {
  const { fax, name } = individualDetail;
  const subject = `Share: ${name}`;
  const mailBody = getTextBodyToShare(individualDetail, config);

  const link = document.createElement('a');

  link.href = `mailto:${fax}?subject=${subject}&body=${mailBody}`;
  link.target = '_blank';
  link.click();
}

export function getHcpFullname(individual: ActivitiesQuery['activities']['edges'][number]['node']['individual']) {
  const { firstName, lastName, middleName } = individual;

  return [firstName, middleName, lastName].filter(s => !!s).join(' ');
}

export function getSuggestionIndividualName(individual: SuggestionsQuery['suggestions']['edges'][number]['node']['individual']) {
  const { firstName, lastName } = individual;

  return [firstName, lastName].filter(s => !!s).join(' ');
}

export function getCombineListTerms(meshTerms?: string[], kvTerms?: string[], chTerms?: string[]) {
  const listTerms = [
    ...(meshTerms || []),
    ...(kvTerms || []),
    ...(chTerms || [])
  ].map(str => str.trim())

  return listTerms
}

export function convertKilometerToMeter(kilometers: number) {
  return kilometers * 1000
}

export function convertMileToMeter(miles: number) {
  return miles * 1609.344 
}

export function convertToMeter(milesOrKilometers: number, unit: DistanceUnit) {
  if (unit === 'km') {
    return convertKilometerToMeter(milesOrKilometers)
  }
  if (unit === 'mi') {
    return convertMileToMeter(milesOrKilometers)
  }
  return milesOrKilometers
}

export function convertMeterToKilometerOrMile(meters: number, unit: DistanceUnit) {
  if (unit === 'km') {
    return meters / 1000
  }
  if (unit === 'mi') {
    return meters / 1609.344
  }
  return meters
}

export function formatDistanceDisplay(meters: number, unit: DistanceUnit) {
  if (unit === 'km' || unit === 'mi') {
    let num = convertMeterToKilometerOrMile(meters, unit)

    if (num < 1) {
      if (unit === 'km') {
        return roundFloatNumber(meters, 1) + 'm'
      }
      if (unit === 'mi') {
        // 1 mile = 5280 feet
        // 1 meter = 3.2808399 feet
        num = meters * 3.2808399
        return roundFloatNumber(num, 1) + 'ft'
      }
    }
    
    return roundFloatNumber(num, 1) + unit
  }
  return roundFloatNumber(meters, 1) + 'm'
}

function roundFloatNumber(num: Number, digits = 0) {
  /**
   * Wrap by Number to remove the zero string at tail. For example digits = 1
   *  - 6.688689 -> '6.7' -> 6.7
   *  - 36.99 -> '37.0' -> 37
   */
  return Number(num.toFixed(digits)) // 
}

export function getCurrentPosition(
  success: (coords: GeolocCoordinates) => void, 
  error: (err: any) => void
) {
  navigator.geolocation.getCurrentPosition((data) => {
    success(data.coords)
  }, error, {
    maximumAge: GEOLOC.MAXAGE,
    timeout: GEOLOC.TIMEOUT,
  })
}


export const handleMapActivities = (item: ActivitiesQuery['activities']['edges'][number], searchedSpecialtyCode?: string) => {
  return {
    distance: formatDistanceDisplay(item.distance, configStore.state.distanceUnit),
    distanceNumber: item.distance,
    relevance: item.relevance,
    name: getHcpFullname(item.node.individual),
    lastName: item.node.individual.lastName,
    professionalType: item.node.individual.professionalType.label,
    specialtiesRaw: getSpecialtiesText((item.node.individual.specialties || [])),
    specialtyPrimary: getSpecialtiesText(
      (item.node.individual.specialties || []).filter(
        specialty => !searchedSpecialtyCode || specialty.code === searchedSpecialtyCode,
      ),
    )[0],
    address: [
      item.node.workplace.address.longLabel,
      item.node.workplace.address.postalCode + ' ' + item.node.workplace.address.city.label,
    ]
      .filter(s => s)
      .join(', '),
    lat: item.node.workplace.address.location.lat,
    lng: item.node.workplace.address.location.lon,
    id: item.node.id,
    reviewsAvailable: item.node.individual.reviewsAvailable,
    diseasesAvailable: item.node.individual.diseasesAvailable,
    url: getUrl(item.node.workplace.address.country, item.node.urls),
  };
};

export function getUrl(_country, urls: Url[]) {
  const appointmentUrl = urls && urls.find(url => url.url?.webcrawled)

  return formatUrl(appointmentUrl?.url.webcrawled)
}

export function formatUrl(url) {
  if (!url) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return 'https://' + url
}

function getSortScope(sortValue: keyof SortValue | string) {
  switch (sortValue) {
    case 'relevance':
      return ActivitySortScope.Relevancy
    case 'distanceNumber':
      return ActivitySortScope.WorkplaceDistance
    case 'lastName':
        return ActivitySortScope.Relevancy
    default:
      return undefined
  }
}

export function getActivitySortScopesFromSortValues(sortValues: SortValue) {
  return Object.entries(sortValues)
    .filter(([_, value]) => !!value && value !== 'SORT_DISABLED')
    .map(([key]) => getSortScope(key))
    .filter(Boolean);
}
