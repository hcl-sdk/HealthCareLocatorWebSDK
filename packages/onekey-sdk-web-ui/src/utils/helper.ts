import { DEFAULT_THEME_PROPERTIES } from 'onekey-sdk-core';
import { Breakpoint } from 'onekey-sdk-web-ui/src/core/types';
import { BREAKPOINT_MAX_WIDTH } from 'onekey-sdk-web-ui/src/core/constants';
import { Activity } from 'onekey-sdk-core/src/graphql/types';

const CONTAINER_ELEMENT = 'onekey-sdk';

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

export function getDoctorCardOffset(cardListItem, selectedMarkerIdx, isVertical = false) {
  const { offsetWidth, offsetHeight } = getContainerHeightWidthOffset();
  let offsetSize = offsetWidth
  let offsetName = 'offsetWidth'
  let itemNewOffset = 0

  console.dir(cardListItem)
  
  if(isVertical) {
    offsetSize = offsetHeight
    offsetName = 'offsetTop'
    const cardItemOffset = cardListItem.children[1]?.children[selectedMarkerIdx]?.[offsetName] || 0
    const gap = offsetSize / 2;
    itemNewOffset = cardItemOffset - (gap - 100)
  } else {
    const cardItemOffset = cardListItem.children[selectedMarkerIdx][offsetName];
    const gap = (offsetSize - cardItemOffset) / 2;
    itemNewOffset = cardItemOffset * selectedMarkerIdx - (gap - 5);
  }

  return itemNewOffset;
}

export function applyDefaultTheme() {
  if (document.getElementById('__onekeysdk-defaults')) {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = '__onekeysdk-defaults';
  styleElement.innerHTML = `onekey-sdk {\n`;
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
  let screenSize;
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
  return results
}

export function getTextBodyToShare({ fax, name, address, phone }, newLine = '%0D%0A', firstLabel = 'Name') {
  return [
    `${firstLabel}: ${name}`,
    `Fax: ${fax}`,
    `Phone: ${phone}`,
    `Address: ${address}`
  ].join(newLine)
}

export function fallbackShareHCPDetail({ fax, name, address, phone }) {
  const newlineChar = `%0D%0A`;
  const subject = `Share: ${name}`;
  const mailBody = getTextBodyToShare({ fax, name, address, phone }, newlineChar);

  const link = document.createElement('a');

  link.href = `mailto:${fax}?subject=${subject}&body=${mailBody}`;
  link.target = '_blank';
  link.click();
}
