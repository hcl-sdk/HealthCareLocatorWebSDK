import { searchMapStore, historyStore, configStore, i18nStore } from '../stores';
import { HistoryHcpItem } from '../stores/HistoryStore';
import { graphql } from '../../../../hcl-sdk-core';
import { IndividualDetail, SearchFields, SearchSpecialty, SearchTermItem, SelectedIndividual, SpecialtyItem } from '../stores/SearchMapStore';
import { 
  getMergeMainAndOtherActivities, 
  getSpecialtiesText, 
  getHcpFullname, 
  getCombineListTerms, 
  convertToMeter, 
  getSpecialties, 
  handleMapActivities,
  getUrl
} from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { getDistance } from 'geolib';
import sortBy from 'lodash.sortby';
import { getGooglePlaceDetails } from './searchGeo';
import {
  ActivityCriteria,
  ActivityCriteriaScope,
  ActivityResult,
  QueryActivitiesArgs,
  QueryCodesByLabelArgs,
  QueryIndividualsByNameArgs,
  SuggestScope,
} from '../../../../hcl-sdk-core/src/graphql/types';

export function groupPointFromBoundingBox(boundingbox: string[]) {
  const bbox = boundingbox.map(strNum => Number(strNum));
  const hashBBox = {
    south: bbox[0],
    north: bbox[1],
    west: bbox[2],
    east: bbox[3]
  }
  const point = {
    bottomRight: { latitude: hashBBox.south, longitude: hashBBox.east },
    topLeft: { latitude: hashBBox.north, longitude: hashBBox.west },
    // bottomLeft: { latitude: hashBBox.south, longitude: hashBBox.west },
    // topRight: { latitude: hashBBox.north, longitude: hashBBox.east }
  }
  return { bbox, hashBBox, point }
}
function getDistanceMeterByAddrDetails(addressDetails: Record<string, string>, boundingbox: string[]) {
  if (!addressDetails) {
    return {
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit)
    }
  }

  if (addressDetails.road) {
    // Precise Address
    return {
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit)
    }
  }

  if (addressDetails.country && (addressDetails.city || addressDetails.state)) {
    // City
    const { point } = groupPointFromBoundingBox(boundingbox)

    const maxDistanceMeter = getDistance(point.topLeft, point.bottomRight, 1);
    return {
      distanceMeter: maxDistanceMeter
    }
  }

  // if (!addressDetails.city && addressDetails.country && addressDetails.country_code) {
  //   return {
  //     country: addressDetails.country_code
  //   }
  // }
  return {  }
}

function getLocationForSuggest() {
  if (!searchMapStore.state.locationFilter) {
    return;
  }

  if (searchMapStore.state.locationFilter.id === NEAR_ME) {
    return {
      lat: Number(searchMapStore.state.geoLocation.latitude),
      lon: Number(searchMapStore.state.geoLocation.longitude),
    };
  }

  return {
    lat: Number(searchMapStore.state.locationFilter.lat),
    lon: Number(searchMapStore.state.locationFilter.lng),
  };
}

export async function genSearchLocationParams({
  forceNearMe = false,
  locationFilter,
  specialtyFilter,
  medicalTermsFilter,
  searchFields
}: {
  forceNearMe?: boolean;
  locationFilter: any;
  specialtyFilter: SpecialtyItem[]
  medicalTermsFilter: SearchTermItem
  searchFields: SearchFields
}) {
  let params: Partial<QueryActivitiesArgs> = {};

  if (forceNearMe || (locationFilter && locationFilter.id === NEAR_ME)) {
    params.location = {
      lat: searchMapStore.state.geoLocation.latitude,
      lon: searchMapStore.state.geoLocation.longitude,
      distanceMeter: convertToMeter(configStore.state.distanceDefault, configStore.state.distanceUnit)
    };
    if (!params.location.distanceMeter) {
      delete params.location.distanceMeter // Don't send this param if developers are not config
    }
    if (forceNearMe) {
      // Basic search near me don't have `specialties` in params
      // In case we keep the data specialtyFilter exist in across the pages
      params.country = configStore.state.countryGeo || configStore.countryGraphqlQuery
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
      ...extraParams // country (removed), ...
    }
    if (distanceMeter) {
      params.location.distanceMeter = distanceMeter
    }
  }
  
  if (specialtyFilter?.length > 0) {
    params.specialties = specialtyFilter.map(arr => arr.id);
  }
  if (medicalTermsFilter) {
    params.medTerms = [medicalTermsFilter.name]; // name ~ longLbl
  }

  const criterias: ActivityCriteria[] = []
  const isFreeTextName = searchFields.name
  const isFreeTextSpecialty = searchFields.specialtyName && !specialtyFilter?.length
  const isFreeTextTerm = configStore.state.enableMedicalTerm && !medicalTermsFilter && searchFields.medicalTerm

  if (isFreeTextName) {
    criterias.push({ text: searchFields.name, scope: ActivityCriteriaScope.IndividualNameAutocomplete })
  }
  if (isFreeTextTerm) {
    criterias.push({ text: searchFields.medicalTerm, scope: ActivityCriteriaScope.IndividualMedTerms })
  }
  if (isFreeTextSpecialty) {
    params.criteria = searchFields.specialtyName
  }
  if (criterias.length) {
    params.criterias = criterias
  }
  
  if (!params.country) {
    params.country = configStore.countryGraphqlQuery
  }

  return params;
}

export async function searchLocationWithParams(forceNearMe: boolean = false) {
  const { locationFilter, specialtyFilter, medicalTermsFilter, searchFields } = searchMapStore.state;

  const params = await genSearchLocationParams({
    forceNearMe,
    locationFilter,
    specialtyFilter,
    medicalTermsFilter,
    searchFields
  });

  if (Object.keys(params).length === 1 && params.country) {
    return
  }

  return searchLocation(params);
}

export async function searchLocation(variables, {
  hasLoading = 'loading',
  isAllowDisplayMapEmpty = false
} = {}) {
  searchMapStore.setState({
    individualDetail: null,
    loadingActivitiesStatus: hasLoading as any
  });

  try {
    let activities: ActivityResult[] = []
    const storeKey = configStore.state.apiKey + '/' + JSON.stringify(variables)

    if (searchMapStore.getCached(storeKey)) {
      activities = searchMapStore.getCached(storeKey)
    } else {
      const resActivities = await graphql.activities({
        first: 50,
        offset: 0,
        locale: i18nStore.state.lang,
        ...variables,
      }, configStore.configGraphql)
      activities = resActivities.activities
      searchMapStore.saveCached(storeKey, resActivities.activities)
    }

    const data = (activities || []).map(handleMapActivities)

    isAllowDisplayMapEmpty = isAllowDisplayMapEmpty && data.length === 0

    // Handle Sort the data
    const sortValues = searchMapStore.state.sortValues;
    const sortByField = Object.keys(searchMapStore.state.sortValues).filter(elm => sortValues[elm]);
    const specialties = sortBy(data, sortByField)

    searchMapStore.setState({
      specialties,
      specialtiesRaw: data,
      searchDoctor: [],
      isAllowDisplayMapEmpty,
      selectedActivity: null,
      individualDetail: null,
      loadingActivitiesStatus: 'success'
    });
  } catch(e) {
    searchMapStore.setState({
      specialties: [],
      specialtiesRaw: [],
      searchDoctor: [],
      selectedActivity: null,
      individualDetail: null,
      isAllowDisplayMapEmpty: false,
      loadingActivitiesStatus: e.response?.status === 401 ? 'unauthorized' : 'error'
    });
  }
}

export async function searchDoctor({ criteria }: Partial<QueryIndividualsByNameArgs>) {
  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggest>[0] = {
    first: 30,
    criteria: criteria,
    locale: i18nStore.state.lang,
    scope: SuggestScope.Individual,
    country: configStore.countryGraphqlQuery,
    specialties: searchMapStore.state.specialtyFilter.map(specialty => specialty.id),
    medTerms: searchMapStore.state.medicalTermsFilter ? [searchMapStore.state.medicalTermsFilter?.id] : [],
    location: getLocationForSuggest(),
  };

  const {
    suggest: { results },
  } = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggest: { results: null } }));

  const individualsData: SelectedIndividual[] = results
    ? results.map(item => {
        const mainActivity = item.individual?.mainActivity;

        const longLabel = mainActivity?.workplace?.address?.longLabel;
        const city = mainActivity?.workplace?.address?.city?.label;
        const postalCode = mainActivity?.workplace?.address?.postalCode;

        return {
          name: getHcpFullname(item.individual),
          specialties: getSpecialtiesText(item.individual.specialties),
          address: [longLabel, postalCode && city ? `${postalCode} ${city}` : ''].join(', '),
          id: mainActivity.id,
          activity: mainActivity,
        };
      })
    : [];

  searchMapStore.setState({ loading: false, searchDoctor: individualsData });
}

export async function handleSearchSpecialty({ criteria }: Partial<QueryCodesByLabelArgs>) {
  if (!criteria || criteria.length < 3) {
    return null;
  }

  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggest>[0] = {
    first: 60,
    criteria: criteria,
    locale: i18nStore.state.lang,
    scope: SuggestScope.Specialty,
    country: configStore.countryGraphqlQuery,
    specialties: [],
    medTerms: searchMapStore.state.medicalTermsFilter ? [searchMapStore.state.medicalTermsFilter?.id] : [],
    location: getLocationForSuggest(),
  };

  const {
    suggest: { results },
  } = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggest: { results: null } }));

  const codesData: SearchSpecialty[] = results
    ? results
        .map(item => ({
          name: `${item.specialty.label}`,
          id: item.specialty.code,
        }))
        .filter(item => item.id.startsWith('SP'))
    : [];

  searchMapStore.setState({ loading: false, searchSpecialty: codesData });  
}

export async function handleSearchMedicalTerms({ criteria }: Partial<QueryCodesByLabelArgs>) {
  if (!criteria || criteria.length < 3) {
    return null;
  }

  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggest>[0] = {
    first: 30,
    criteria: criteria,
    locale: i18nStore.state.lang,
    scope: SuggestScope.MedTerm,
    country: configStore.countryGraphqlQuery,
    specialties: searchMapStore.state.specialtyFilter.map(specialty => specialty.id),
    medTerms: [],
    location: getLocationForSuggest(),
  };

  const {
    suggest: { results },
  } = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggest: { results: null } }));

  const codesData: SearchTermItem[] = results ? results.map((item) => ({
    name: item.medTerm.label,
    id: item.medTerm.code,
    lisCode: ''
  })) : []

  searchMapStore.setState({ loading: false, searchMedicalTerms: codesData });
}


export async function getFullCardDetail({ activityId, activityName }, keyLoading = 'loadingIndividualDetail') {
  searchMapStore.setState({
    individualDetailName: activityName,
    [keyLoading]: true
  });

  const { activityByID: activity } = await graphql.activityByID({
    id: activityId,
    locale: i18nStore.state.lang
  }, configStore.configGraphql)

  const data: IndividualDetail = {
    id: activityId,
    individualId: activity.individual.id,
    name: getHcpFullname(activity.individual),
    firstName: activity.individual.firstName,
    lastName: activity.individual.lastName,
    middleName: activity.individual.middleName,
    professionalType: activity.individual.professionalType.label,
    specialties: getSpecialties(activity.individual.specialties),
    listTerms: getCombineListTerms(activity.individual.meshTerms, activity.individual.kvTerms, activity.individual.chTerms),
    addressName: activity.workplace.name,
    addressBuildingName: activity.workplace.address.buildingLabel,
    address: activity.workplace.address.longLabel,
    postalCode: activity.workplace.address.postalCode,
    city: activity.workplace.address.city.label,
    country: activity.workplace.address.county.label,
    webAddress: activity.webAddress,
    phone: activity.phone || activity.workplace.localPhone || activity.workplace.intlPhone,
    fax: activity.fax || activity.workplace.intlFax,
    lat: activity.workplace.address.location.lat,
    lng: activity.workplace.address.location.lon,

    activitiesList: getMergeMainAndOtherActivities(activity.individual.mainActivity, activity.individual.otherActivities),
    uciRpps: activity.individual.uci?.rpps,
    uciAdeli: activity.individual.uci?.adeli,
    reviewsAvailable: activity.individual.reviewsAvailable,
    diseasesAvailable: activity.individual.diseasesAvailable,
    reviewsByIndividual: undefined,
    url: getUrl(activity.workplace.address.country, activity.url),
    openHours: activity.workplace.openHours
  };

  // Fetch to get reviews
  let idnat: string

  if (data.uciRpps) {
    idnat = '8' + data.uciRpps
  } else if (data.uciAdeli) {
    idnat = '0' + data.uciAdeli
  }

  if (idnat) {
    const { reviewsByIndividual } = await graphql.reviewsByIndividual({
      idnat
    }, configStore.configGraphql)

    if (reviewsByIndividual) {
      data.reviewsByIndividual = {
        idnat: reviewsByIndividual.idnat,
        reviews: reviewsByIndividual.reviews || [],
        diseases: reviewsByIndividual.diseases || []
      }
    }
  }

  // add to history
  // TODO: disable if userId is defined
  const historyItem: HistoryHcpItem = {
    type: 'hcp',
    activityId,
    activity: activity,
    timestamp: Date.now(),
  };
  historyStore.addItem('hcp', historyItem);


  searchMapStore.setState({
    individualDetail: data,
    individualDetailName: '',
    [keyLoading]: false
  });
}
