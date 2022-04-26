import { searchMapStore } from '../../../core/stores';

export const getFirstSelectionPath = hcoDetail => {
  if (!hcoDetail.children || hcoDetail.children.length === 0) {
    return [];
  }

  return [hcoDetail.children[0].id, ...getFirstSelectionPath(hcoDetail.children[0])];
};

export const recreateChildHcoSelectionPath = (currentSelectedChildHcoIds, idx, hcoId, originalHCODetail) => {
  // ['lvl1', 'lvl2', 'lvl3']
  const newSelections = [...currentSelectedChildHcoIds];
  newSelections[idx] = hcoId; // ['lvl1', 'lvl2-NEW', 'lvl3']
  const newSelectionRoot = newSelections.slice(0, idx + 1) // ['lvl1', 'lvl2-NEW']

  const hco = getChildHco(originalHCODetail, newSelectionRoot);

  return [...newSelectionRoot, ...(hco ? getFirstSelectionPath(hco) : [])]
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
