import { searchMapStore } from '../stores';
import { graphql } from 'onekey-sdk-core'
import { SelectedIndividual } from '../stores/SearchMapStore';
import { getSpecialtiesText } from '../../utils/helper';

export async function searchLocation(variables) {
  const mockLat = 48.863699;
  const mockLng = 2.4833;

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
    distance: `${item.distance} km`,
    name: `${item.activity.individual.firstName} ${item.activity.individual.lastName}`,
    specialtiesRaw: getSpecialtiesText(item.activity.individual.specialties),
    specialties: getSpecialtiesText(item.activity.individual.specialties)[0],
    address: `${item.activity.workplace.address.longLabel},${item.activity.workplace.address.city.label},${item.activity.workplace.address.country}`,
    lat: mockLat + (0.0001*idx),
    lng: mockLng + (0.001*idx),
    id: item.activity.individual.id
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
    name: `${item.firstName} ${item.lastName}`,
    specialties: getSpecialtiesText(item.specialties),
    address: `${item.workplace.address.longLabel},${item.workplace.address.country}`,
    id: item.id
  })) : []


  const codesData: SelectedIndividual[] = codes ? codes.map((item) => ({ 
    name: `${item.longLbl}`,
    id: item.id
  })) : []

  const data = [...codesData, ...individualsData]


  searchMapStore.setState({ loading: false, searchDoctor: data }); 
}


export async function getIndividualDetail(variables) {
  searchMapStore.setState({ loading: true, individualDetail: null });

  const { individualByID } = await graphql.individualsByID({
    apiKey: "1",
    ...variables,
  })

  const data = {
    name: individualByID.mailingName,
    specialties: getSpecialtiesText(individualByID.specialties),
    address: individualByID.mainActivity.workplace.address.longLabel,
    addressName: individualByID.mainActivity.workplace.name,
    postalCode: individualByID.mainActivity.workplace.address.postalCode,
    city: individualByID.mainActivity.workplace.address.city.label,
    country: individualByID.mainActivity.workplace.address.county.label,
    phone: individualByID.mainActivity.workplace.localPhone,
    fax: individualByID.mainActivity.workplace.intlFax
  }

  searchMapStore.setState({ loading: false, individualDetail: data }); 
}