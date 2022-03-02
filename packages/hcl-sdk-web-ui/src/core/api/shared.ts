import { getDistance } from 'geolib';
import {
    ActivityCriteria,
    ActivityCriteriaScope, QueryActivitiesArgs
} from '../../../../hcl-sdk-core/src/graphql/types';
import {
    convertToMeter
} from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { configStore, searchMapStore } from '../stores';
import { SearchFields, SearchTermItem, SortValue, SpecialtyItem } from '../stores/SearchMapStore';
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

function getDistanceMeterByAddrDetails(addressDetails: Record<string, string>, boundingbox: string[]) {
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

    const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1);
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

  const locationFilter = searchMapStore.state.locationFilter;
  const distanceMeter = convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit) || 20000;

  if (searchMapStore.state.locationFilter.id === NEAR_ME) {
    return {
      lat: Number(searchMapStore.state.geoLocation.latitude),
      lon: Number(searchMapStore.state.geoLocation.longitude),
      distanceMeter,
    };
  }

  // locatioFilter has place_id mean it using Google Map
  if (locationFilter.place_id) {
    const placeDetail = await getGooglePlaceDetails(locationFilter.place_id);

    return {
      lat: Number(placeDetail.lat),
      lon: Number(placeDetail.lng),
      distanceMeter,
    };
  }

  return {
    lat: Number(searchMapStore.state.locationFilter.lat),
    lon: Number(searchMapStore.state.locationFilter.lng),
    distanceMeter,
  };
}

export async function genSearchLocationParams({
  forceNearMe = false,
  locationFilter,
  specialtyFilter,
  medicalTermsFilter,
  searchFields,
}: {
  forceNearMe?: boolean;
  locationFilter: any;
  specialtyFilter: SpecialtyItem[];
  medicalTermsFilter: SearchTermItem;
  searchFields: SearchFields;
}) {
  let params: Partial<QueryActivitiesArgs> = {};

  if (forceNearMe || (locationFilter && locationFilter.id === NEAR_ME)) {
    params.location = {
      lat: searchMapStore.state.geoLocation.latitude,
      lon: searchMapStore.state.geoLocation.longitude,
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit),
    };
    if (!params.location.distanceMeter) {
      delete params.location.distanceMeter; // Don't send this param if developers are not config
    }
    if (forceNearMe) {
      // Basic search near me don't have `specialties` in params
      // In case we keep the data specialtyFilter exist in across the pages
      params.country = configStore.state.countryGeo || configStore.countryGraphqlQuery;
      return params;
    }
  } else if (locationFilter) {
    let addressDetails = locationFilter.addressDetails;
    let boundingbox = locationFilter.boundingbox;
    let lat = locationFilter.lat;
    let lon = locationFilter.lng;

    if (locationFilter.place_id) {
      const placeDetail = await getGooglePlaceDetails(locationFilter.place_id);
      addressDetails = placeDetail.addressDetails;
      boundingbox = placeDetail.boundingbox;
      lat = placeDetail.lat;
      lon = placeDetail.lng;
    }

    const { distanceMeter, ...extraParams } = getDistanceMeterByAddrDetails(addressDetails, boundingbox);
    params = {
      location: {
        lat: Number(lat),
        lon: Number(lon),
        // distanceMeter: distanceMeter
      },
      ...extraParams, // country (removed), ...
    };
    if (distanceMeter) {
      params.location.distanceMeter = distanceMeter;
    }
  }

  if (specialtyFilter?.length > 0) {
    params.specialties = specialtyFilter.map(arr => arr.id);
  }
  if (medicalTermsFilter) {
    params.medTerms = [medicalTermsFilter.name]; // name ~ longLbl
  }

  const criterias: ActivityCriteria[] = [];
  const isFreeTextName = searchFields.name;
  const isFreeTextSpecialty = searchFields.specialtyName && !specialtyFilter?.length;
  const isFreeTextTerm = configStore.state.enableMedicalTerm && !medicalTermsFilter && searchFields.medicalTerm;

  if (isFreeTextName) {
    criterias.push({ text: searchFields.name, scope: ActivityCriteriaScope.IndividualNameAutocomplete });
  }
  if (isFreeTextTerm) {
    criterias.push({ text: searchFields.medicalTerm, scope: ActivityCriteriaScope.IndividualMedTerms });
  }
  if (isFreeTextSpecialty) {
    params.criteria = searchFields.specialtyName;
  }
  if (criterias.length) {
    params.criterias = criterias;
  }

  if (!params.country) {
    params.country = configStore.countryGraphqlQuery;
  }

  return params;
}


export function shouldSortFromServer(sortValues: SortValue) {
  return Object.entries(sortValues)
    .filter(([_, value]) => !!value && value !== 'SORT_DISABLED')
    .some(([key]) => ['distanceNumber', 'relevance'].includes(key));
}
