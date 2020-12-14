import { DEFAULT_THEME_PROPERTIES } from 'onekey-sdk-core';

const CONTAINER_ELEMENT = 'onekey-sdk';

export function selectSDKElement() {
  return document.querySelector(CONTAINER_ELEMENT);
}

export function getCssColor(colorStyle) {
  return getComputedStyle(document.querySelector(CONTAINER_ELEMENT).shadowRoot.host).getPropertyValue(colorStyle);
}

export function initAppCSSWidthHeight() {
  const elm = document.querySelector(CONTAINER_ELEMENT);
  const { offsetWidth, offsetHeight } = getContainerHeightWidthOffset();
  elm.style.setProperty('--app-width', `${offsetWidth}px`);
  elm.style.setProperty('--app-height', `${offsetHeight}px`);

  elm.style.setProperty('--app-width-small-2x', `${offsetWidth / 2}px`);
  elm.style.setProperty('--app-height-small-2x', `${offsetHeight / 2}px`);
}

export function getContainerHeightWidthOffset() {
  const elm = document.querySelector(CONTAINER_ELEMENT);

  return {
    offsetWidth: elm?.offsetWidth || 0,
    offsetHeight: elm?.offsetHeight || 0,
  };
}

export function getDoctorCardOffset(cardListItem, selectedMarkerIdx) {
  const { offsetWidth } = getContainerHeightWidthOffset();
  const cardItemOffsetWidth = cardListItem.children[selectedMarkerIdx].offsetWidth;
  const gap = (offsetWidth - cardItemOffsetWidth) / 2;
  const itemNewOffset = cardItemOffsetWidth * selectedMarkerIdx - (gap - 5);
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
