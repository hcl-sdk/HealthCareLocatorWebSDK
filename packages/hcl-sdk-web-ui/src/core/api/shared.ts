import { getDistance } from 'geolib';
import {
  convertToMeter
} from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { configStore, searchMapStore } from '../stores';
import { SortValue } from '../stores/SearchMapStore';
import { getGooglePlaceDetails } from './searchGeo';

export function groupPointFromBoundingBox(boundingbox: string[]) {
  const bbox = boundingbox.map(strNum => Number(strNum));
  const hashBBox = {
    south: bbox[0],
    north: bbox[1],
    west: bbox[2],
    east: bbox[3],
  };
  const point = {
    bottomRight: { latitude: hashBBox.south, longitude: hashBBox.east },
    topLeft: { latitude: hashBBox.north, longitude: hashBBox.west },
    // bottomLeft: { latitude: hashBBox.south, longitude: hashBBox.west },
    // topRight: { latitude: hashBBox.north, longitude: hashBBox.east }
  };
  return { bbox, hashBBox, point };
}

// export for HCO's genSearchLocationParams to use
export function getDistanceMeterByAddrDetails(addressDetails: Record<string, string>, boundingbox: string[]) {
  if (!addressDetails) {
    return {
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit),
    };
  }

  if (addressDetails.road) {
    // Precise Address
    return {
      distanceMeter: convertToMeter(20, 'km'),
    };
  }

  if (addressDetails.country && (addressDetails.city || addressDetails.state)) {
    // City
    const { point } = groupPointFromBoundingBox(boundingbox);

    const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1) / 2;
    return {
      distanceMeter: maxDistanceMeter,
    };
  }

  return {};
}

export function countryCodeForSuggest(countryCode: typeof configStore.countryGraphqlQuery) {
  switch (countryCode) {
    case 'UK':
      return 'GB';
    case 'BK':
      return 'HR';
    default:
      return countryCode;
  }
}

export async function getLocationForSuggest() {
  if (!searchMapStore.state.locationFilter) {
    return;
  }

  if (searchMapStore.state.locationFilter.id === NEAR_ME) {
    return {
      lat: Number(searchMapStore.state.geoLocation.latitude),
      lon: Number(searchMapStore.state.geoLocation.longitude),
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit) || 20000
    };
  }

  const locationFilter = searchMapStore.state.locationFilter;
  let addressDetails = locationFilter.addressDetails;
  let boundingbox = locationFilter.boundingbox;

  // locatioFilter has place_id mean it using Google Map
  if (locationFilter.place_id) {
    const placeDetail = await getGooglePlaceDetails(locationFilter.place_id);
    addressDetails = placeDetail.addressDetails;
    boundingbox = placeDetail.boundingbox;

    return {
      lat: Number(placeDetail.lat),
      lon: Number(placeDetail.lng),
      distanceMeter: getDistanceMeterByAddrDetails(addressDetails, boundingbox).distanceMeter
    };
  }

  return {
    lat: Number(searchMapStore.state.locationFilter.lat),
    lon: Number(searchMapStore.state.locationFilter.lng),
    distanceMeter: getDistanceMeterByAddrDetails(addressDetails, boundingbox).distanceMeter
  };
}

export function shouldSortFromServer(sortValues: SortValue) {
  return Object.entries(sortValues)
    .filter(([_, value]) => !!value && value !== 'SORT_DISABLED')
    .some(([key]) => ['distanceNumber', 'relevance'].includes(key));
}
