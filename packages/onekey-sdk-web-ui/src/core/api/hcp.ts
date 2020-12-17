import { searchMapStore } from '../stores';
import { graphql } from 'onekey-sdk-core'
import { SelectedIndividual } from '../stores/SearchMapStore';
import { getSpecialtiesText } from '../../utils/helper';

export async function searchLocation(variables) {
  searchMapStore.setState({ loading: true });

  const { activities } = await graphql.activities({
    apiKey: "1",
    first: 10,
    offset: 0,
    specialties: [],
    county: "",
    ...variables,
  })

  const data = activities.map((item, idx) => ({
    distance: `${item.distance}m`,
    name: item.activity.individual.mailingName,
    professionalType: item.activity.individual.professionalType.label,
    specialtiesRaw: getSpecialtiesText(item.activity.individual.specialties),
    specialties: getSpecialtiesText(item.activity.individual.specialties)[0],
    address: `${item.activity.workplace.address.longLabel},${item.activity.workplace.address.city.label}`,
    lat: item.activity.workplace.address.location.lat,
    lng: item.activity.workplace.address.location.lon,
    id: item.activity.id
  }))

  searchMapStore.setState({ specialties: data, searchDoctor: [], loading: false });
}

export async function searchDoctor(variables) {
  if(variables.criteria.length < 3) {
    return null;
  }
  searchMapStore.setState({ loading: true, searchDoctor: [], specialties: [] });

  const { individualsByName: { individuals } } = await graphql.individualsByName({
    apiKey: "1",
    locale: "en",
    first: 5,
    offset: 0,
    ...variables,
  })

  const { codesByLabel: { codes } } = await graphql.codesByLabel({
    apiKey: "1",
    first: 5,
    offset: 0,
    codeTypes: ["SP"],
    locale: "en",
    ...variables,
  })

  const individualsData: SelectedIndividual[] = individuals ? individuals.map((item) => ({ 
    name: item.mailingName,
    professionalType: item.professionalType.label,
    specialties: getSpecialtiesText(item.specialties),
    address: `${item.mainActivity.workplace.address.longLabel},${item.mainActivity.workplace.address.city.label}`,
    id: item.mainActivity.id
  })) : []


  const codesData: SelectedIndividual[] = codes ? codes.map((item) => ({ 
    name: `${item.longLbl}`,
    id: item.id
  })) : []

  const data = [...codesData, ...individualsData]


  searchMapStore.setState({ loading: false, searchDoctor: data }); 
}


export async function getFullCardDetail(variables) {
  searchMapStore.setState({ loading: true, individualDetail: null });

  const { activityByID: activity } = await graphql.activityByID({
    apiKey: "1",
    id: variables.id,
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

  searchMapStore.setState({ loading: false, individualDetail: data }); 
}