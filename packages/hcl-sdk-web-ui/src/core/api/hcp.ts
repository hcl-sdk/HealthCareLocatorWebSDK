import { searchMapStore, historyStore, configStore, i18nStore } from '../stores';
import { HistoryHcpItem } from '../stores/HistoryStore';
import { graphql } from 'hcl-sdk-core'
import { SelectedIndividual } from '../stores/SearchMapStore';
import { getMergeMainAndOtherActivities, getSpecialtiesText, getHcpFullname } from '../../utils/helper';
import { NEAR_ME, DISTANCE_METER } from '../constants';
import { getDistance } from 'geolib';
import sortBy from 'lodash.sortby';

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
      distanceMeter: DISTANCE_METER.DEFAULT
    }
  }

  if (addressDetails.road) {
    // Precise Address
    return {
      distanceMeter: DISTANCE_METER.DEFAULT
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

  if (!addressDetails.city && addressDetails.country && addressDetails.country_code) {
    return {
      country: addressDetails.country_code
    }
  }
}

export function genSearchLocationParams({
  forceNearMe = false,
  locationFilter,
  specialtyFilter,
}) {
  let params: any = {};
  if (forceNearMe || (locationFilter && locationFilter.id === NEAR_ME)) {
    params.location = {
      lat: searchMapStore.state.geoLocation.latitude,
      lon: searchMapStore.state.geoLocation.longitude,
      distanceMeter: DISTANCE_METER.NEAR_ME
    };

    if (forceNearMe) {
      // Basic search near me don't have `specialties` in params
      // In case we keep the data specialtyFilter exist in across the pages
      return params;
    }
  } else if (locationFilter) {
    const { addressDetails, boundingbox } = locationFilter;
    const { distanceMeter, ...extraParams } = getDistanceMeterByAddrDetails(addressDetails, boundingbox)
    params = {
      location: {
        lat: Number(locationFilter.lat),
        lon: Number(locationFilter.lng),
        distanceMeter: distanceMeter
      },
      ...extraParams // country, ...
    }
  }
  if (specialtyFilter) {
    params.specialties = [specialtyFilter.id];
  }
  return params;
}

export async function searchLocationWithParams(forceNearMe: boolean = false) {
  const { locationFilter, specialtyFilter } = searchMapStore.state;
  const { countries } = configStore.state

  const params = genSearchLocationParams({
    forceNearMe,
    locationFilter,
    specialtyFilter
  });

  if (!specialtyFilter) {
    params.criteria = searchMapStore.state.searchFields.name
  }

  if (!params.country && countries && countries.length !== 0) {
    params.country = String(countries)
  }

  searchLocation(params);
}

export async function searchLocation(variables, { 
  hasLoading = 'loading', 
  isAcceptEmptyData = true 
} = {}) {
  searchMapStore.setState({
    individualDetail: null,
    loadingActivitiesStatus: hasLoading as any
  });

  try {
    const { activities } = await graphql.activities({
      first: 50,
      offset: 0,
      locale: i18nStore.state.lang,
      ...variables,
    }, configStore.configGraphql)
  
    const data = (activities || []).map((item) => ({
      distance: `${item.distance}m`,
      distanceNumber: item.distance,
      relevance: item.relevance,
      name: getHcpFullname(item.activity.individual),
      lastName: item.activity.individual.lastName,
      professionalType: item.activity.individual.professionalType.label,
      specialtiesRaw: getSpecialtiesText(item.activity.individual.specialties),
      specialties: getSpecialtiesText(item.activity.individual.specialties)[0],
      address: `${item.activity.workplace.address.longLabel},${item.activity.workplace.address.city.label}`,
      lat: item.activity.workplace.address.location.lat,
      lng: item.activity.workplace.address.location.lon,
      id: item.activity.id
    }))

    if (!isAcceptEmptyData && data.length === 0) {
      return
    }

    // Handle Sort the data
    const sortValues = searchMapStore.state.sortValues;
    const sortByField = Object.keys(searchMapStore.state.sortValues).filter(elm => sortValues[elm]);
    const specialties = sortBy(data, sortByField)
  
    searchMapStore.setState({
      specialties,
      specialtiesRaw: data,
      searchDoctor: [],
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
      loadingActivitiesStatus: 'error'
    });
  }
}

export async function searchDoctor(variables) {
  if (variables.criteria.length < 3) {
    return null;
  }
  searchMapStore.setState({ loading: true });

  const [
    { individualsByName: { individuals } },
    { codesByLabel: { codes } }
  ] = await Promise.all(
    [
      graphql.individualsByName({
        locale: i18nStore.state.lang,
        first: 5,
        offset: 0,
        ...variables,
      }, configStore.configGraphql).catch(_ => ({ individualsByName: { individuals: null } })),
      graphql.codesByLabel({
        first: 5,
        offset: 0,
        codeTypes: ["SP"],
        locale: i18nStore.state.lang,
        ...variables,
      }, configStore.configGraphql).catch(_ => ({ codesByLabel: { codes: null } }))
    ]
  )

  const individualsData: SelectedIndividual[] = individuals ? individuals.map((item) => ({
    name: getHcpFullname(item),
    professionalType: item.professionalType.label,
    specialties: getSpecialtiesText(item.specialties),
    address: `${item.mainActivity.workplace.address.longLabel},${item.mainActivity.workplace.address.city.label}`,
    id: item.mainActivity.id,
    activity: item.mainActivity
  })) : []


  const codesData: SelectedIndividual[] = codes ? codes.map((item) => ({
    name: `${item.longLbl}`,
    id: item.id
  })) : []

  const data = [...codesData, ...individualsData]


  searchMapStore.setState({ loading: false, searchDoctor: data });
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

  const data = {
    id: activityId,
    individualId: activity.individual.id,
    name: getHcpFullname(activity.individual),
    firstName: activity.individual.firstName,
    lastName: activity.individual.lastName,
    middleName: activity.individual.middleName,
    professionalType: activity.individual.professionalType.label,
    specialties: getSpecialtiesText(activity.individual.specialties),
    addressName: activity.workplace.name,
    addressBuildingName: activity.workplace.address.buildingLabel,
    address: activity.workplace.address.longLabel,
    postalCode: activity.workplace.address.postalCode,
    city: activity.workplace.address.city.label,
    country: activity.workplace.address.county.label,
    webAddress: activity.webAddress,
    phone: activity.phone,
    fax: activity.fax,
    lat: activity.workplace.address.location.lat,
    lng: activity.workplace.address.location.lon,

    activitiesList: getMergeMainAndOtherActivities(activity.individual.mainActivity, activity.individual.otherActivities)
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
