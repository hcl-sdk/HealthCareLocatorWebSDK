import { searchMapStore, historyStore } from '../stores';
import { HistoryHcpItem } from '../stores/HistoryStore';
import { graphql } from 'onekey-sdk-core'
import { SelectedIndividual } from '../stores/SearchMapStore';
import { getSpecialtiesText } from '../../utils/helper';
import { NEAR_ME } from '../constants';

export async function searchLocationWithParams() {
  const params: any = {};
  if (searchMapStore.state.locationFilter) {
    if (searchMapStore.state.locationFilter.id === NEAR_ME) {
      params.location = searchMapStore.state.currentLocation;
    } else {
      params.location = {
        lat: Number(searchMapStore.state.locationFilter.lat),
        lon: Number(searchMapStore.state.locationFilter.lng),
      };
    }
  }
  if (searchMapStore.state.specialtyFilter) {
    params.specialties = [searchMapStore.state.specialtyFilter.id];
  }
  searchLocation(params);
}

export async function searchLocation(variables) {
  searchMapStore.setState({ 
    individualDetail: null, 
    loadingActivities: true 
  });

  const { activities } = await graphql.activities({
    apiKey: "1",
    first: 50,
    offset: 0,
    county: "",
    ...variables,
  })

  const data = activities.map((item) => ({
    distance: `${item.distance}m`,
    name: item.activity.individual.mailingName,
    lastName: item.activity.individual.lastName,
    professionalType: item.activity.individual.professionalType.label,
    specialtiesRaw: getSpecialtiesText(item.activity.individual.specialties),
    specialties: getSpecialtiesText(item.activity.individual.specialties)[0],
    address: `${item.activity.workplace.address.longLabel},${item.activity.workplace.address.city.label}`,
    lat: item.activity.workplace.address.location.lat,
    lng: item.activity.workplace.address.location.lon,
    id: item.activity.id
  }))

  searchMapStore.setState({ 
    specialties: data, 
    specialtiesRaw: data, 
    searchDoctor: [], 
    selectedActivity: null, 
    individualDetail: null, 
    loadingActivities: false 
  });
}

export async function searchDoctor(variables) {
  if(variables.criteria.length < 3) {
    return null;
  }
  searchMapStore.setState({ loading: true });

  const [
    { individualsByName: { individuals } },
    { codesByLabel: { codes } }
  ] = await Promise.all(
    [
      graphql.individualsByName({
        apiKey: "1",
        locale: "en",
        first: 5,
        offset: 0,
        ...variables,
      }),
      graphql.codesByLabel({
        apiKey: "1",
        first: 5,
        offset: 0,
        codeTypes: ["SP"],
        locale: "en",
        ...variables,
      })
    ]
  )

  const individualsData: SelectedIndividual[] = individuals ? individuals.map((item) => ({
    name: item.mailingName,
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


export async function getFullCardDetail({ activityId, activityName }) {
  searchMapStore.setState({ 
    individualDetail: null,
    individualDetailName: activityName,
    loadingIndividualDetail: true
  });

  const { activityByID: activity } = await graphql.activityByID({
    apiKey: "1",
    id: activityId,
  })

  const data = {
    name: activity.individual.mailingName,
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
    lng: activity.workplace.address.location.lon
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
    loadingIndividualDetail: false
  });
}
