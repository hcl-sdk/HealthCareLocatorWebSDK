import { searchMapStore } from '../../../core/stores';
import { HCOServiceItem } from '../../../core/stores/SearchMapStore';

export const getFirstSelectionPath = hcoDetail => {
  if (!hcoDetail.children || hcoDetail.children.length === 0) {
    return [];
  }

  return [hcoDetail.children[0].id, ...getFirstSelectionPath(hcoDetail.children[0])];
};
export const getFirstServiceSelect = hcoDetail => {
  if (!hcoDetail.children || hcoDetail.children.length === 0) {
    return [];
  }

  return [hcoDetail[0].id, ...getFirstSelectionPath(hcoDetail.children[0])];
};

export const recreateChildHcoSelectionPath = (currentSelectedChildHcoIds, idx, hcoId, originalHCODetail) => {
  // ['lvl1', 'lvl2', 'lvl3']
  const newSelections = [...currentSelectedChildHcoIds];
  newSelections[idx] = hcoId; // ['lvl1', 'lvl2-NEW', 'lvl3']
  const newSelectionRoot = newSelections.slice(0, idx + 1) // ['lvl1', 'lvl2-NEW']

  const hco = getChildHco(originalHCODetail, newSelectionRoot);

  return [...newSelectionRoot, ...(hco ? getFirstSelectionPath(hco) : [])]
};
export const recreateServiceHcoSelectionPath = (currentSelectedChildHcoIds: string[], idx: number, newServiceID: string, serviceList: HCOServiceItem[]) => {
  // ['lvl1', 'lvl2', 'lvl3']
  const newSelections = [...currentSelectedChildHcoIds];
  newSelections[idx] = newServiceID; // ['lvl1', 'lvl2-NEW', 'lvl3']
  const newSelectionRoot = newSelections.slice(0, idx + 1) // ['lvl1', 'lvl2-NEW']

  const hco = getServiceHco(serviceList, newSelectionRoot);

  return [...newSelectionRoot, ...(hco ? getFirstServiceSelect(hco) : [])]
};

export const makeChildHcoSelects = (hcoDetail, selectedChildHcoId) => {
  let selectPaths = [];

  selectedChildHcoId.forEach((_, idx) => {
    selectPaths.push(selectedChildHcoId.slice(0, idx + 1));
  });

  return [
    hcoDetail && (hcoDetail.children && hcoDetail.children.length) ? hcoDetail.children.map(i => ({ value: i.id, label: i.name })) : null,
    ...selectPaths.map(path => mapChildrenToOptions(getChildHco(hcoDetail, path))),
  ].filter(Boolean);
};
export const makeServiceSelects = (servicesList, selectedServiceIDs) => {
  let selectPaths = [];

  selectedServiceIDs.forEach((_, idx) => {
    selectPaths.push(selectedServiceIDs.slice(0, idx + 1));
  });

  return [
    ...selectPaths.map(path => mapServicesToOptions(getServiceHco(servicesList, path) as HCOServiceItem[])),
  ].filter(Boolean);
};

const mapChildrenToOptions = (hcoDetail: typeof searchMapStore.state.hcoDetail) => {
  if (!hcoDetail) {
    return null;
  }
  const options = hcoDetail.children
    ? hcoDetail.children.map(c => ({
        value: c.id,
        label: c.name,
      }))
    : null;

  return options;
};
const mapServicesToOptions = (servicesList: HCOServiceItem[]) => {
  if (!servicesList) {
    return null;
  }
  const options = servicesList
    ? servicesList.map(c => ({
        ...c,
        value: c.id,
        label: c.name,
      }))
    : null;

  return options;
};

/**
 * 
 * @param hcoDetail HCO Detail
 * @param path array of child hco ids, leftmost is outermose level, rightmost is inner-most nested child hco
 * @returns child hco inside a hco
 */
export const getChildHco = (hcoDetail: typeof searchMapStore.state.hcoDetail, path: string[]) => {
  if (!hcoDetail.children || hcoDetail.children.length === 0) {
    return null;
  }
  let hco = hcoDetail;
  for (const level of path) {
    if (!hco.children) {
      break;
    }
    for (const child of hco.children) {
      if (child.id === level) {
        hco = child;
        break;
      }
    }
  }
  return hco;
};

export function getServiceHco(serviceList: HCOServiceItem[], path: string[], isGetItem: boolean = false) {
  if (!serviceList || serviceList.length === 0) {
    return null;
  }

  let currentServiceList = serviceList
  let currentServiceItem: HCOServiceItem
  path.forEach((item) => {
    const index = currentServiceList?.findIndex(serviceObj => item === serviceObj.id)
    currentServiceItem = typeof index == 'number' && index > -1 ? currentServiceList[index] : null
    currentServiceList = typeof index == 'number' && index > -1 ? currentServiceList[index].children : null
  })
  if (isGetItem) {
    return currentServiceItem
  }
  return currentServiceList
};
