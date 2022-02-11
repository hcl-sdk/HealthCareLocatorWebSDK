import { DEFAULT_THEME_PROPERTIES, DARK_THEME_PROPERTIES } from '../../../hcl-sdk-core';
import { Breakpoint, ScreenSize, GeolocCoordinates } from '../core/types';
import { BREAKPOINT_MAX_WIDTH, GEOLOC } from '../core/constants';
import {
  ActivityList,
  ActivityResult,
  ActivitySortScope,
  Individual,
  IndividualFragment,
  IndividualSuggestFragment,
  KeyedString,
  Url,
} from '../../../hcl-sdk-core/src/graphql/types';
import { t } from '../utils/i18n';
import { DistanceUnit } from '../core/stores/ConfigStore';
import { SearchSpecialty, SortValue } from '../core/stores/SearchMapStore'
import { configStore } from '../core/stores';

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

export function getSpecialtiesText(specialties) {
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

export function getMergeMainAndOtherActivities(mainActivity: ActivityList, otherActivities: ActivityList[] = []) {
  let results: ActivityList[];
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

export function getHcpFullname(individual: Individual | IndividualFragment | IndividualSuggestFragment) {
  const { firstName, lastName, middleName } = individual;

  return [firstName, middleName, lastName].filter(s => !!s).join(' ');
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

export const handleMapActivities = (item: ActivityResult) => ({
  distance: formatDistanceDisplay(item.distance, configStore.state.distanceUnit),
  distanceNumber: item.distance,
  relevance: item.relevance,
  name: getHcpFullname(item.activity.individual),
  lastName: item.activity.individual.lastName,
  professionalType: item.activity.individual.professionalType.label,
  specialtiesRaw: getSpecialtiesText(item.activity.individual.specialties),
  specialtyPrimary: getSpecialtiesText(item.activity.individual.specialties)[0],
  address: [
    item.activity.workplace.address.longLabel, 
    item.activity.workplace.address.postalCode + ' ' + item.activity.workplace.address.city.label
  ].filter(s => s).join(', '),
  lat: item.activity.workplace.address.location.lat,
  lng: item.activity.workplace.address.location.lon,
  id: item.activity.id,
  reviewsAvailable: item.activity.individual.reviewsAvailable,
  diseasesAvailable: item.activity.individual.diseasesAvailable,
  url: getUrl(item.activity.workplace.address.country, item.activity.urls)
})

export function getUrl(_country, urls: Url[]) {
  const appointmentUrl = urls && urls[0]?.url?.webcrawled;

  if (!appointmentUrl) {
    return null
  }

  if (appointmentUrl.startsWith('http') || appointmentUrl.startsWith('//')) {
    return appointmentUrl;
  }

  return 'https://' + appointmentUrl
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

export function getServerSideSortFields(sortValue: (keyof SortValue | string)[]) {
    return sortValue.map(sortValue => getSortScope(sortValue)).filter(Boolean)
}

export function getClientSideSortFields(sortValue: (keyof SortValue | string)[]) {
  return sortValue.filter(field => field === 'lastName')
}