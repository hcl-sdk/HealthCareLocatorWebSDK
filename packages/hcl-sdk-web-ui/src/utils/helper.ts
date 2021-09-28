import { DEFAULT_THEME_PROPERTIES } from '../../../hcl-sdk-core';
import { Breakpoint, ScreenSize } from '../core/types';
import { BREAKPOINT_MAX_WIDTH } from '../core/constants';
import { ActivityList, Individual, IndividualFragment } from '../../../hcl-sdk-core/src/graphql/types';
import { t } from '../utils/i18n';
import { DistanceUnit } from '../core/stores/ConfigStore';

const CONTAINER_ELEMENT = 'hcl-sdk';

export function selectSDKElement() {
  return document.querySelector(CONTAINER_ELEMENT);
}

export function getCssColor(colorStyle) {
  return getComputedStyle(document.querySelector(CONTAINER_ELEMENT).shadowRoot.host).getPropertyValue(colorStyle);
}

export function getContainerHeightWidthOffset() {
  const elm = document.querySelector(CONTAINER_ELEMENT);

  return {
    offsetWidth: elm?.offsetWidth || 0,
    offsetHeight: elm?.offsetHeight || 0,
  };
}

export function getDoctorCardOffset(cardListItem, selectedMarkerIdx, isVertical = false, isCentered = false) {
  const { offsetWidth, offsetHeight } = getContainerHeightWidthOffset();
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

export function applyDefaultTheme() {
  if (document.getElementById('__hclsdk-defaults')) {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = '__hclsdk-defaults';
  styleElement.innerHTML = `hcl-sdk {\n`;
  for (const prop of Object.keys(DEFAULT_THEME_PROPERTIES)) {
    const value = DEFAULT_THEME_PROPERTIES[prop];
    styleElement.innerHTML += `  ${prop}: ${value};\n`;
  }
  styleElement.innerHTML += `\n}`;
  document.head.prepend(styleElement);
}

export function getSpecialtiesText(specialties) {
  return specialties.filter(elm => elm.label).map(elm => elm.label)
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

export function getHcpFullname(individual: Individual | IndividualFragment) {
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
    let fixedNumber = 10000 // 4 digits

    return (parseInt(String(num * fixedNumber)) / fixedNumber) + unit
  }
  return meters + 'm'
}