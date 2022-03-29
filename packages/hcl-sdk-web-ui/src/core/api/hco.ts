import { graphql } from '../../../../hcl-sdk-core';
import { SuggestionScope, SuggestionsV2Query, WorkplaceCriteria, WorkplaceCriteriaScope, WorkplacesV2QueryVariables } from '../../../../hcl-sdk-core/src/graphql/types';
import { convertToMeter, formatDistanceDisplay, getSpecialtiesText, getUrl } from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { configStore, i18nStore, searchMapStore } from '../stores';
import { SearchFields, SEARCH_TARGET, SortValue } from '../stores/SearchMapStore';
import { getGooglePlaceDetails } from './searchGeo';
import { countryCodeForSuggest, getDistanceMeterByAddrDetails, getLocationForSuggest } from './shared';

export async function genSearchLocationParams({ forceNearMe = false, locationFilter, searchFields }: { forceNearMe?: boolean; locationFilter: any; searchFields: SearchFields }) {
  let params: Partial<WorkplacesV2QueryVariables> = {};

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

  const criterias: WorkplaceCriteria[] = [];
  const isFreeTextName = searchFields.name;

  if (isFreeTextName) {
    criterias.push({ text: searchFields.name, scope: WorkplaceCriteriaScope.Name });
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
  const { locationFilter, searchFields } = searchMapStore.state;

  const params = await genSearchLocationParams({
    forceNearMe,
    locationFilter,
    searchFields,
  });

  if (Object.keys(params).length === 1 && params.country) {
    return;
  }

  return searchLocation(params);
}

export async function changeSortValue(_sortValue: SortValue) {
  // Not implemented
}

export async function searchLocation(variables, { hasLoading = 'loading', isAllowDisplayMapEmpty = false } = {}) {
  searchMapStore.setState({
    hcoDetail: null,
    loadingHcosStatus: hasLoading as any,
  });

  try {
    const hcos = (
      await graphql.workplacesV2(
        {
          ...variables,
          first: 50,
          offset: 0,
        },
        configStore.configGraphql,
      )
    ).workplacesV2.edges.map(edge =>
      toHCO({
        id: edge.node?.id,
        name: edge.node?.name,
        type: edge.node?.type.label,
        distanceNumber: edge.distance,
        distance: formatDistanceDisplay(edge.distance, configStore.state.distanceUnit),
        lat: edge.node?.address.location?.lat,
        lng: edge.node?.address.location?.lon,
        address: formatHCOAddress(edge.node),
      }),
    );

    searchMapStore.setState({
      hcoDetail: null,
      selectedHco: null,
      hcos,
      // TODO: if not allow redirect to no result, used for map relaunch case
      isAllowDisplayMapEmpty: isAllowDisplayMapEmpty && hcos.length === 0,
      loadingHcosStatus: 'success',
    });
  } catch (e) {
    searchMapStore.setState({
      loadingActivitiesStatus: e.response?.status === 401 ? 'unauthorized' : 'error',
    });
  }
}

export async function getFullCardDetail({ hcoId }, keyLoading = 'loadingHcoDetail') {
  searchMapStore.setState({
    [keyLoading]: true,
  });

  const hco = await graphql.workplaceByIDV2(
    {
      id: hcoId,
    },
    configStore.configGraphql,
  );

  const hcoDetail = toHCO({
    ...getHCOCoreFields(hco.workplaceByIDV2),
    children: hco.workplaceByIDV2?.children.map(childHCO => {
      return getHCOCoreFields(childHCO);
    }),
  });

  // TODO: history item
  searchMapStore.setState({
    hcoDetail: hcoDetail,
    [keyLoading]: false,
  });

  return hcoDetail;
}

export async function searchHcos({ criteria }: { criteria: string }) {
  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggestionV2>[0] = {
    first: 30,
    criteria: criteria,
    locale: i18nStore.state.lang,
    country: countryCodeForSuggest(configStore.countryGraphqlQuery),
    location: await getLocationForSuggest(),
    scope: SuggestionScope.Workplace,
  };

  const {
    suggestionsV2: { edges },
  }: SuggestionsV2Query = await graphql.suggestionV2(variables, configStore.configGraphql).catch(_ => ({ suggestionsV2: { edges: [] } }));

  const hcos = edges
    ? edges.map(({ node }) => {
        return toHCO({
          name: node.workplace?.name,
          type: node.workplace?.type,
          address: formatHCOAddress(node),
          id: node.workplace.id,
        });
      })
    : [];

  searchMapStore.setState({ loading: false, searchHcos: hcos });
}

function toHCO(data) {
  return {
    __type: SEARCH_TARGET.HCO,
    ...data
  }
}

function getHCOCoreFields(data) {
  return {
    id: data?.id,
    name: data?.name,
    type: data?.type.label,
    address: [data?.address.longLabel, data?.address.postalCode + ' ' + data?.address.city.label].filter(s => s).join(', '),
    phone: data?.intlPhone,
    fax: data?.intlFax,
    website: data?.webAddress,
    lat: data?.address?.location?.lat,
    lng: data?.address?.location?.lon,
    individuals: data.individuals.map(individual => toIndividualCore(individual, data))
  };
}

function toIndividualCore(individual, workplace) {
  return {
    id: individual.id,
    name: [individual.firstName, individual.middleName, individual.lastName].filter(s => !!s).join(' '),
    specialty: getSpecialtiesText(individual.specialties)[0],
    isShowRecommendation: individual.reviewsAvailable || individual.diseasesAvailable,
    url: getUrl(workplace?.address.country, individual.mainActivity.urls),
    mainActivity: individual.mainActivity,
  };
}

function formatHCOAddress(node) {
  return (
    node.address?.longLabel && [node.address?.longLabel, node.address?.postalCode && node.address?.city ? `${node.address?.postalCode} ${node.address?.city.label}` : ''].join(', ')
  );
}