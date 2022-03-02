import { formatDistanceDisplay } from '../../utils/helper';
import { configStore, searchMapStore } from '../stores';
import { SortValue } from '../stores/SearchMapStore';
import { genSearchLocationParams } from './shared';

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

export async function changeSortValue(_sortValue: SortValue) {
  // Not implemented
}

export async function searchLocation(_variables, { hasLoading = 'loading', isAllowDisplayMapEmpty = false } = {}) {
  searchMapStore.setState({
    hcoDetail: null,
    loadingHcosStatus: hasLoading as any,
  });

  try {
    await delay(1000);

    const hcos = [
      {
        id: 'hco1',
        name: 'Lariboisière Hospital AP-HP',
        department: 'Hospitla',
        address: '2 Rue Ambroise Paré, 75010 Paris',
        distanceNumber: 82,
        distance: formatDistanceDisplay(82, configStore.state.distanceUnit),
        lat: 50.9519359,
        lng: 1.8339621,
      },
    ];

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

  await delay(400);

  const data = {
    id: hcoId,
    name: 'Institut Curie Hospital',
    department: 'Hospital',
    address: `Institut Curie Hospital 26 Rue d'Ulm, 75005 Paris`,
    phone: '01 44 58 56 58',
    website: 'http://hopital-lariboisiere.aphp.fr/',
    fax: '01 44 58 56 58',
    lat: 50.9519359,
    lng: 1.8339621,
    specialties: [],
    individuals: [
      {
        service: 'Cardiology',
        subService: 'Echocardiology',
        name: 'Dr Boksenbaum Michel',
        specialty: 'General practitioner',
      },
      {
        service: 'Cardiology',
        subService: 'Echocardiology',
        name: 'Dr William Dahan',
        specialty: 'General practitioner',
      },
    ],
    uci: '1053364778',
  };

  // TODO: history item
  searchMapStore.setState({
    hcoDetail: data,
    [keyLoading]: false,
  });
}

const delay = timeMs =>
  new Promise(res => {
    setTimeout(res, timeMs);
  });
