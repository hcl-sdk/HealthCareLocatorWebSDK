import { graphql } from '../../../../hcl-sdk-core';
import {
  SuggestionScope,
  SuggestionsQuery,
  WorkplaceByIdQuery,
  WorkplaceCriteria,
  WorkplaceCriteriaScope,
  WorkplaceSortScope,
  WorkplacesQueryVariables,
} from '../../../../hcl-sdk-core/src/graphql/types';
import { convertToMeter, formatDistanceDisplay, formatUrl, getSpecialtiesText, getUrl } from '../../utils/helper';
import { NEAR_ME } from '../constants';
import { configStore, historyStore, i18nStore, searchMapStore } from '../stores';
import { createHCOHistoryItem } from '../stores/HistoryStore';
import { HCOServiceItem, SearchFields, SEARCH_TARGET, SortValue } from '../stores/SearchMapStore';
import { getGooglePlaceDetails } from './searchGeo';
import lodashGet from 'lodash.get'
import { countryCodeForSuggest, getDistanceMeterByAddrDetails, getLocationForSuggest } from './shared';
import rfdc from 'rfdc';

export enum HCO_SERVICE_ACTION {
  LOADMORE = 'load_more',
  PATCH = 'patch',
}

export enum KEY_LOADING_SERVICE_LABEL {
  'loadingHCOServices',
  'loadingHCOServicesLv1',
  'loadingHCOServicesLv2'
}

export async function genSearchLocationParams({ forceNearMe = false, locationFilter, searchFields }: { forceNearMe?: boolean; locationFilter: any; searchFields: SearchFields }) {
  let params: Partial<WorkplacesQueryVariables> = {};

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

export async function changeSortValue(sortValue: SortValue) {
  searchMapStore.setSortValues(sortValue);
  searchMapStore.setHcosLoadingStatus('loading');

  try {
    const { locationFilter, searchFields, sortValues } = searchMapStore.state;
    const sorts = getSortScopesFromSortValues(sortValues);

    const params = await genSearchLocationParams({
      locationFilter,
      searchFields,
    });

    if (Object.keys(params).length === 1 && params.country) {
      return;
    }

    const hcos = await fetchWorkplaces({ ...params, sortScope: sorts[0] });

    searchMapStore.setState({ hcos });

    searchMapStore.setHcosLoadingStatus('success');
  } catch (err) {
    searchMapStore.setHcosLoadingStatus(err.response?.status === 401 ? 'unauthorized' : 'error');
  }
}

async function fetchWorkplaces(variables) {
  const hcos =
    (
      await graphql.workplaces(
        {
          ...variables,
          first: 50,
          offset: 0,
          locale: i18nStore.state.lang,
        },
        configStore.configGraphql,
      )
    ).workplaces?.edges?.map(edge =>
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
    ) || [];

  return hcos;
}

export async function searchLocation(variables, { hasLoading = 'loading', isAllowDisplayMapEmpty = false } = {}) {
  searchMapStore.setHcosLoadingStatus(hasLoading as any);
  searchMapStore.setState({ hcoDetail: null, selectedHco: null, selectedActivity: null, individualDetail: null });

  try {
    const { sortValues } = searchMapStore.state;

    const sorts = getSortScopesFromSortValues(sortValues);
    const hcos = await fetchWorkplaces({ ...variables, sortScope: sorts[0] });

    searchMapStore.setState({
      hcoDetail: null,
      selectedHco: null,
      hcos,
      // TODO: if not allow redirect to no result, used for map relaunch case
      isAllowDisplayMapEmpty: isAllowDisplayMapEmpty && hcos.length === 0,
      loadingHcosStatus: 'success',
    });
  } catch (e) {
    searchMapStore.setHcosLoadingStatus(e.response?.status === 401 ? 'unauthorized' : 'error');
  }
}

export async function getFullCardDetail({ hcoId }, keyLoading = 'loadingHcoDetail') {
  searchMapStore.setState({
    [keyLoading]: true,
  });

  const hco = await graphql.workplaceByID(
    {
      id: hcoId,
      locale: i18nStore.state.lang,
    },
    configStore.configGraphql,
  );

  const hcoDetail = toHCO({
    ...getHCOCoreFields(hco.workplaceByID),
    children: hco.workplaceByID?.children.map(childHCO => {
      return getHCOCoreFields(childHCO);
    }),
  });

  historyStore.addItem(createHCOHistoryItem(hcoDetail));

  searchMapStore.setState({
    hcoDetail: hcoDetail,
    [keyLoading]: false,
  });

  return hcoDetail;
}

interface HCOServiceDetailQueryVariables {
  hcoId: string;
  firstService: number;
  offsetFirstService: number;
  firstIndividual?: number;
  offsetFirstIndividual?: number;
  secondService?: number;
  offsetSecondService?: number;
  secondIndividual?: number;
  offsetSecondIndividual?: number;
  thirdService?: number;
  offsetThirdService?: number;
  thirdIndividual?: number;
  offsetThirdIndividual?: number;
}

export async function getHCOServicesDetail({
  hcoId,
  firstService,
  offsetFirstService,
  firstIndividual = 10,
  offsetFirstIndividual = 0,
  secondService = 10,
  offsetSecondService = 0,
  secondIndividual = 10,
  offsetSecondIndividual = 0,
  thirdService = 10,
  offsetThirdService = 0,
  thirdIndividual = 10,
  offsetThirdIndividual = 0,
}: HCOServiceDetailQueryVariables, keyLoading: string = 'loadingHCOServices') {
  searchMapStore.setState({
    [keyLoading]: true,
  });

  const servicesHCO = await graphql.servicesByWorkplacesID(
    {
      id: hcoId,
      locale: i18nStore.state.lang,
      firstService: firstService,
      offsetFirstService: offsetFirstService,
      firstIndividual,
      offsetFirstIndividual,
      secondService,
      offsetSecondService,
      secondIndividual,
      offsetSecondIndividual,
      thirdService,
      offsetThirdService,
      thirdIndividual,
      offsetThirdIndividual,
    },
    configStore.configGraphql,
  );

  return servicesHCO.workplaceByID.children.map((childHCO, index) => getHCOCoreFieldsPaginateData(childHCO, index));
}

export async function getHCOServices({ hcoId }) {
  const listService = await getHCOServicesDetail({ hcoId, firstService: 10, offsetFirstService: 0 });
  return listService
}

export type LoadmoreServicesVar = {
  hcoID: string,
  childServiceIds?: string[]
}

export async function loadmoreServiceByWorkplaceID({ hcoID, childServiceIds = [] }: LoadmoreServicesVar) {
  const { hcoDetailServicesLoadMore } = searchMapStore.state;
  let serviceIDList = hcoDetailServicesLoadMore[hcoID];
  let arrayOffset = []
  
  if (!hcoID || !serviceIDList) {
    searchMapStore.setState({
      loadingHCOServices: false,
    });
    return undefined;
  }
  let arrayServicePath = []
  let queryObject: HCOServiceDetailQueryVariables = {
    hcoId: hcoID,
    firstService: 10, offsetFirstService: serviceIDList.length
  }
  
  if (childServiceIds.length > 0) {
    childServiceIds.forEach((childService) => {
      const childIndex = serviceIDList.findIndex((item) => item.id === childService)
      if (childIndex > -1) {
        serviceIDList = serviceIDList[childIndex].children
        arrayServicePath.push({
          childId: childService,
          index: childIndex,
          path: `[${childIndex}].children`
        })
        arrayOffset.push(childIndex)
      }
    })
  }
  if (arrayOffset.length > 0) {
    arrayOffset.forEach((item , index) => {
      queryObject = {
        ...queryObject,
        ...(index === 0 && {
          firstService: 1,
          offsetFirstService: item,
          secondService: 10,
          offsetSecondService: serviceIDList.length
        }),
        ...(index === 1 && {
          secondService: 1,
          offsetSecondService: item,
          thirdService: 10,
          offsetThirdService: serviceIDList.length
        })
      }
    })
  }
  const lvLoadingKey = KEY_LOADING_SERVICE_LABEL[arrayOffset.length]
  const queryString = JSON.stringify(queryObject) 
  if (queryServiceHasLoadmore(queryString)) {
    searchMapStore.setState({
      [lvLoadingKey]: false,
    });
    return
  }
  // start to fetch loadmore
  const fetchMoreServices = await getHCOServicesDetail(queryObject, lvLoadingKey);
  if (fetchMoreServices && fetchMoreServices.length > 0) {
    if (!arrayOffset.length) {
      searchMapStore.setState({
        hcoDetailServicesLoadMore: {
          ...hcoDetailServicesLoadMore,
          [hcoID]: [...serviceIDList, ...fetchMoreServices],
        },
        [lvLoadingKey]: false,
      });
    } else {
      const servicesListIdCloned = rfdc({proto: false})(hcoDetailServicesLoadMore[hcoID])
      const path = arrayServicePath.map((item) => item.path).join('')
      const listLoadmore = lodashGet(servicesListIdCloned, path)
      if (!Array.isArray(listLoadmore)) {
        searchMapStore.setState({
          [lvLoadingKey]: false,
        });
        return
      }
      const fetchMoreServicesList = lodashGet(fetchMoreServices, '[0].children'.repeat(arrayOffset.length))
      listLoadmore.push(...fetchMoreServicesList)
      searchMapStore.setState({
        hcoDetailServicesLoadMore: {
          ...hcoDetailServicesLoadMore,
          [hcoID]: [...servicesListIdCloned],
        },
        [lvLoadingKey]: false,
      });
    }
  } else {
    // To not allow to loadmore again if there's no loadmore for this specific queryKey
    searchMapStore.setState({
      [lvLoadingKey]: false,
      HCOServicesByWorkplaceIdNoLoadmore: {
        ...searchMapStore.state.HCOServicesByWorkplaceIdNoLoadmore,
        [queryString]: true
      }
    });
  }
}
export async function loadmoreIndividualByServiceWorkplaceID({ hcoID, selectedServiceIDs }: { hcoID: string, selectedServiceIDs: string[] }) {
  const { hcoDetailServicesLoadMore } = searchMapStore.state;
  let serviceIDList = hcoDetailServicesLoadMore[hcoID];
  let queryObject: HCOServiceDetailQueryVariables = {
    hcoId: hcoID,
    firstService: 10, offsetFirstService: serviceIDList.length
  }
  let arrayServicePath : {pathToChildService: string, currentService: HCOServiceItem, pathToCurrentService: string, serviceOffset: number}[] = []
  selectedServiceIDs.forEach((item, index) => {
    const indexSelected = serviceIDList.findIndex(serviceItem => serviceItem.id === item)
    if (indexSelected > -1) {
      arrayServicePath.push({
        pathToChildService: `[${indexSelected}}].children`,
        currentService: serviceIDList[indexSelected],
        pathToCurrentService: `${index > 0 ? '.children': ''}[${indexSelected}]`,
        serviceOffset: indexSelected
      })
      serviceIDList = serviceIDList[indexSelected].children
    }
  })
  arrayServicePath.forEach((item, idx) => {
    if (idx === 0) {
      queryObject = {
        ...queryObject,
        firstService: 1,
        offsetFirstService: item.serviceOffset,
        firstIndividual: 10,
        offsetFirstIndividual: item.currentService.individuals.length,
      }
    } else if (idx === 1) {
      queryObject = {
        ...queryObject,
        firstIndividual: 0,
        secondService: 1,
        offsetSecondService: item.serviceOffset,
        secondIndividual: 10,
        offsetSecondIndividual: item.currentService.individuals.length
      }
    } else if (idx === 2) {
      queryObject = {
        ...queryObject,
        secondIndividual: 0,
        thirdService: 1,
        offsetThirdService: item.serviceOffset,
        thirdIndividual: 10,
        offsetThirdIndividual: item.currentService.individuals.length
      }
    }
  })
  const queryString = JSON.stringify(queryObject)
  if (queryServiceHasLoadmore(queryString)) {
    searchMapStore.setState({
      loadingHCOServiceIndividual: false,
    });
    return
  }
  const fetchDataServiceIndividual = await getHCOServicesDetail(queryObject, 'loadingHCOServiceIndividual')
  if (fetchDataServiceIndividual && fetchDataServiceIndividual.length > 0) {
    const servicesListIdCloned = rfdc({proto: false})(hcoDetailServicesLoadMore[hcoID])
    const path = arrayServicePath.map((item) => item.pathToCurrentService).join('')
    const listLoadmore = lodashGet(servicesListIdCloned, `${path}.individuals`)
    if (!Array.isArray(listLoadmore)) {
      searchMapStore.setState({
        loadingHCOServiceIndividual: false,
      });
      return
    }
    const pathToFetchedData = arrayServicePath.length === 1 ? '[0].individuals' : `[0]${'.children[0]'.repeat(arrayServicePath.length - 1)}.individuals`
    const fetchMoreIndividualList = lodashGet(fetchDataServiceIndividual, pathToFetchedData)
    listLoadmore.push(...fetchMoreIndividualList)
    searchMapStore.setState({
      hcoDetailServicesLoadMore: {
        ...hcoDetailServicesLoadMore,
        [hcoID]: [...servicesListIdCloned],
      },
      loadingHCOServiceIndividual: false,
    });
  } else {
    searchMapStore.setState({
      loadingHCOServiceIndividual: false,
      HCOServicesByWorkplaceIdNoLoadmore: {
        ...searchMapStore.state.HCOServicesByWorkplaceIdNoLoadmore
      }
    });
  }
}

export async function searchHcos({ criteria }: { criteria: string }) {
  searchMapStore.setState({ loading: true });

  const variables: Parameters<typeof graphql.suggest>[0] = {
    first: 30,
    criteria: criteria,
    locale: i18nStore.state.lang,
    country: countryCodeForSuggest(configStore.countryGraphqlQuery),
    location: await getLocationForSuggest(),
    scope: SuggestionScope.Workplace,
  };

  const {
    suggestions: { edges },
  }: SuggestionsQuery = await graphql.suggest(variables, configStore.configGraphql).catch(_ => ({ suggestions: { edges: [] } }));

  const hcos = edges
    ? edges.map(({ node }) => {
        return toHCO({
          name: node.workplace?.name,
          hcoType: node.workplace?.type?.label,
          address: formatHCOAddress(node),
          id: node.workplace.id,
        });
      })
    : [];

  searchMapStore.setState({ loading: false, searchHcos: hcos });
}

function queryServiceHasLoadmore(queryString: string) {
  return !!searchMapStore.state.HCOServicesByWorkplaceIdNoLoadmore[queryString]
}

function toHCO<T>(data: T) {
  return {
    __type: SEARCH_TARGET.HCO,
    ...data,
  };
}

function getHCOCoreFields(data: WorkplaceByIdQuery['workplaceByID']) {
  return {
    id: data?.id,
    name: data?.name,
    type: data?.type.label,
    buildingLabel: data.address.buildingLabel,
    address: formatHCOAddress(data),
    phone: data?.intlPhone,
    fax: data?.intlFax,
    website: formatUrl(data?.webAddress),
    lat: data?.address?.location?.lat,
    lng: data?.address?.location?.lon,
    individuals: data.individuals.map(individual => toIndividualCore(individual, data))
  };
}
function getHCOCoreFieldsPaginateData(data: WorkplaceByIdQuery['workplaceByID'], offsetParent: number) {
  return {
    id: data?.id,
    name: data?.name,
    type: data?.type.label,
    buildingLabel: data.address.buildingLabel,
    address: formatHCOAddress(data),
    phone: data?.intlPhone,
    fax: data?.intlFax,
    website: formatUrl(data?.webAddress),
    lat: data?.address?.location?.lat,
    lng: data?.address?.location?.lon,
    individuals: data.individuals.map(individual => toIndividualCore(individual, data)),
    offsetParent: offsetParent ?? 0,
    children: data.children?.map((item, index) => getHCOCoreFieldsPaginateData(item, index))
  };
}

function toIndividualCore(individual: WorkplaceByIdQuery['workplaceByID']['individuals'][number], workplace: WorkplaceByIdQuery['workplaceByID']) {
  return {
    id: individual.id,
    name: [individual.firstName, individual.middleName, individual.lastName].filter(s => !!s).join(' '),
    specialty: getSpecialtiesText(individual?.specialties || [])[0],
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

function getSortScopesFromSortValues(sortValues: SortValue) {
  return Object.entries(sortValues)
    .filter(([_, value]) => !!value && value !== 'SORT_DISABLED')
    .map(([key]) => getSortScope(key))
    .filter(Boolean);
}

function getSortScope(sortValue: keyof SortValue | string) {
  switch (sortValue) {
    case 'relevance':
      return WorkplaceSortScope.Relevancy;
    case 'distanceNumber':
      return WorkplaceSortScope.Distance;
    case 'name':
      return WorkplaceSortScope.Name;
    default:
      return undefined;
  }
}
