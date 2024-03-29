import sortBy from 'lodash.sortby';
import { graphql } from '../../../../hcl-sdk-core';
import {
  ActivitiesQuery,
  ActivityCriteria,
  ActivityCriteriaScope,
  QueryActivitiesArgs, QueryCodesByLabelArgs, QuerySuggestionsArgs, SuggestionScope, SuggestionsQuery
} from '../../../../hcl-sdk-core/src/graphql/types';
import {
  convertToMeter,
  formatUrl,
  getActivitySortScopesFromSortValues,
  getCombineListTerms,
  getHcpFullname,
  getMergeMainAndOtherActivities,
  getSpecialties,
  getSuggestionIndividualName,
  getUrl,
  handleMapActivities
} from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { configStore, featureStore, historyStore, i18nStore, searchMapStore } from '../stores';
import { createHCPHistoryItem } from '../stores/HistoryStore';
import { IndividualDetail, SearchFields, SearchSpecialty, SearchTermItem, SortValue, SpecialtyItem } from '../stores/SearchMapStore';
import { getGooglePlaceDetails } from './searchGeo';
import { countryCodeForSuggest, getDistanceMeterByAddrDetails, getLocationForSuggest, shouldSortFromServer } from './shared';

function notHaveGeoLocationZero(item: { node?: { workplace?: { address?: { location?: { lat; lon } } } } }) {
  const location = item?.node?.workplace?.address?.location;
  return !(location?.lat === 0 && location?.lon === 0);
}

function notActivityNull(item: { node?: { individual?: { activity?: any } } }) {
  return Boolean(item.node?.individual?.activity);
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
    params.medTerms = [medicalTermsFilter.id]; // name ~ longLbl, id ~ code
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
    criterias.push({ text: searchFields.specialtyName, scope: ActivityCriteriaScope.IndividualSpecialties });
  }
  if (criterias.length) {
    params.criterias = criterias;
  }

  if (!params.country) {
    params.country = configStore.countryGraphqlQuery;
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
    searchFields,
  });

  if (Object.keys(params).length === 1 && params.country) {
    return;
  }

  return searchLocation(params);
}

export async function changeSortValue(sortValue: SortValue) {
  searchMapStore.setSortValues(sortValue);
  searchMapStore.setActivitiesLoadingStatus('loading');

  try {
    const { locationFilter, specialtyFilter, medicalTermsFilter, searchFields, sortValues } = searchMapStore.state;

    let sorts = undefined;

    const sortFromServer = shouldSortFromServer(sortValues);
    if (sortFromServer) {
      sorts = getActivitySortScopesFromSortValues(sortValues);
    }

    const params = await genSearchLocationParams({
      forceNearMe: false,
      locationFilter,
      specialtyFilter,
      medicalTermsFilter,
      searchFields,
    });

    if (Object.keys(params).length === 1 && params.country) {
      return;
    }

    const data = await fetchActivities({ ...params, sorts });

    let specialties = data;
    if (!sortFromServer) {
      specialties = sortBy(data, 'lastName');
    }

    searchMapStore.setState({
      specialties,
      specialtiesRaw: data,
    });

    searchMapStore.setActivitiesLoadingStatus('success');
  } catch (err) {
    searchMapStore.setActivitiesLoadingStatus(err.response?.status === 401 ? 'unauthorized' : 'error');
  }
}

async function fetchActivities(variables) {
  let activities: ActivitiesQuery = {};
  const storeKey = configStore.state.apiKey + '/' + JSON.stringify(variables);

  if (searchMapStore.getCached(storeKey)) {
    activities = searchMapStore.getCached(storeKey);
  } else {
    const resActivities = await graphql.activities(
      {
        first: 50,
        offset: 0,
        locale: i18nStore.state.lang,
        ...variables,
      },
      configStore.configGraphql,
    );
    activities = resActivities;
    searchMapStore.saveCached(storeKey, resActivities);
  }

  const data = (activities?.activities?.edges || [])
    .filter(item => notHaveGeoLocationZero(item))
    .map(activity => handleMapActivities(activity, variables.specialties && variables.specialties[0]));

  return data;
}

export async function searchLocation(variables, { hasLoading = 'loading', isAllowDisplayMapEmpty = false } = {}) {
  searchMapStore.setState({
    individualDetail: null,
    loadingActivitiesStatus: hasLoading as any,
    hcoDetail: null,
    selectedHco: null
  });

  try {
    const { sortValues } = searchMapStore.state;

    let sorts = undefined;
    const sortFromServer = shouldSortFromServer(sortValues);
    if (sortFromServer) {
      sorts = getActivitySortScopesFromSortValues(sortValues);
    }

    const data = await fetchActivities({ sorts, ...variables });

    isAllowDisplayMapEmpty = isAllowDisplayMapEmpty && data.length === 0;

    let specialties = data;
    if (!sortFromServer) {
      specialties = sortBy(data, 'lastName');
    }

    searchMapStore.setState({
      specialties,
      specialtiesRaw: data,
      searchDoctor: [],
      isAllowDisplayMapEmpty,
      selectedActivity: null,
      individualDetail: null,
      loadingActivitiesStatus: 'success',
    });
  } catch (e) {
    searchMapStore.setState({
      specialties: [],
      specialtiesRaw: [],
      searchDoctor: [],
      selectedActivity: null,
      individualDetail: null,
      isAllowDisplayMapEmpty: false,
      loadingActivitiesStatus: e.response?.status === 401 ? 'unauthorized' : 'error',
    });
  }
}

export async function searchDoctor({ criteria }: Partial<QuerySuggestionsArgs>) {
  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggest>[0] = {
    first: 30,
    criteria: criteria,
    locale: i18nStore.state.lang,
    scope: SuggestionScope.Individual,
    country: countryCodeForSuggest(configStore.countryGraphqlQuery),
    specialties: searchMapStore.state.specialtyFilter.map(specialty => specialty.id),
    medTerms: searchMapStore.state.medicalTermsFilter ? [searchMapStore.state.medicalTermsFilter?.id] : [],
    location: await getLocationForSuggest(),
  };

  const {
    suggestions: { edges },
  }: SuggestionsQuery = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggestions: { edges: [] } }));

  const currentSpecialtyFitler = variables.specialties && variables.specialties[0]
  const individualsData = edges
    ? edges
        .filter(item => notActivityNull(item))
        .map(item => {
          const activity = item.node?.individual?.activity

          const longLabel = activity?.workplace?.address?.longLabel;
          const city = activity?.workplace?.address?.city?.label;
          const postalCode = activity?.workplace?.address?.postalCode;

          const specialties = item?.node?.individual.specialties;
          const defaultDisplaySpecialty = specialties[0]?.label;
          const prioritizedDisplaySpecialty = specialties.filter(
            specialty => !currentSpecialtyFitler || specialty.code === currentSpecialtyFitler,
          )[0]?.label;

          return {
            name: getSuggestionIndividualName(item?.node?.individual),
            specialty: prioritizedDisplaySpecialty || defaultDisplaySpecialty,
            address: [longLabel, postalCode && city ? `${postalCode} ${city}` : ''].join(', '),
            id: activity.id,
            activity: activity,
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
    scope: SuggestionScope.Specialty,
    country: countryCodeForSuggest(configStore.countryGraphqlQuery),
    specialties: [],
    medTerms: searchMapStore.state.medicalTermsFilter ? [searchMapStore.state.medicalTermsFilter?.id] : [],
    location: await getLocationForSuggest(),
  };

  const {
    suggestions: { edges },
  }: SuggestionsQuery = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggestions: { edges: null } }));

  const codesData: SearchSpecialty[] = edges
    ? edges
        .map(item => ({
          name: `${item?.node?.specialty.label}`,
          id: item?.node?.specialty.code,
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
    // MedTerms are only availble in English, and Suggest query is locate awared,
    // so Suggest query is not working for MedTerm search with locale other than English.
    // Change: temporarily use locale "en" for scope "MedTerm in Suggest query regardless of locale setting.
    locale: 'en', // i18nStore.state.lang,
    scope: SuggestionScope.MedTerm,
    country: countryCodeForSuggest(configStore.countryGraphqlQuery),
    specialties: searchMapStore.state.specialtyFilter.map(specialty => specialty.id),
    medTerms: [],
    location: await getLocationForSuggest(),
  };

  const {
    suggestions: { edges },
  }: SuggestionsQuery = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggestions: { edges: null } }));

  const codesData: SearchTermItem[] = edges
    ? edges.map(item => ({
        name: item?.node?.medTerm.label,
        id: item?.node?.medTerm.code,
        lisCode: '',
      }))
    : [];

  searchMapStore.setState({ loading: false, searchMedicalTerms: codesData });
}

export async function getFullCardDetail({ activityId, activityName }, keyLoading = 'loadingIndividualDetail') {
  searchMapStore.setState({
    individualDetailName: activityName,
    [keyLoading]: true,
  });

  const { activityByID: activity } = await graphql.activityByID(
    {
      id: activityId,
      locale: i18nStore.state.lang,
    },
    configStore.configGraphql,
  );

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
    webAddress: formatUrl(activity.webAddress),
    phone: activity.phone || activity.workplace.localPhone || activity.workplace.intlPhone,
    fax: activity.fax || activity.workplace.intlFax,
    lat: activity.workplace.address.location.lat,
    lng: activity.workplace.address.location.lon,

    activitiesList: getMergeMainAndOtherActivities(activity.individual.mainActivity, activity.individual.otherActivities),
    uciRpps: activity.individual.uci?.rpps,
    uciAdeli: activity.individual.uci?.adeli,
    uciGln: activity.individual.uci?.gln,
    uciNpi: activity.individual.uci?.npi,
    uciLanr: activity.individual.uci?.lanr,
    uciZsr: activity.individual.uci?.zsr,
    reviewsAvailable: activity.individual.reviewsAvailable,
    diseasesAvailable: activity.individual.diseasesAvailable,
    reviews: undefined,
    url: getUrl(activity.workplace.address.country, activity.urls),
    openHours: activity.workplace.openHours,
  };

  // Fetch to get reviews
  let idnat: string;

  if (featureStore.isPatientRecommendationEnabled && (data.diseasesAvailable || data.reviewsAvailable)) {
    if (data.uciRpps) {
      idnat = '8' + data.uciRpps;
    } else if (data.uciAdeli) {
      idnat = '0' + data.uciAdeli;
    }

    if (idnat) {
      const { reviews } = await graphql.reviewsByIndividual(
        {
          idnat,
        },
        configStore.configGraphql,
      );

      if (reviews) {
        data.reviews = {
          idnat: reviews.idnat,
          reviews: reviews.reviews || [],
          diseases: reviews.diseases || [],
        };
      }
    }
  }

  // add to history
  // TODO: disable if userId is defined
  historyStore.addItem(
    createHCPHistoryItem({
      id: activity.id,
      individual: activity.individual,
      workplace: activity.workplace,
    }),
  );

  searchMapStore.setState({
    individualDetail: data,
    individualDetailName: '',
    [keyLoading]: false,
  });
}
