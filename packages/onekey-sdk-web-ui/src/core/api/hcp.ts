import { searchMapStore } from '../stores';
import { graphql } from 'onekey-sdk-core'

export async function searchLocation(_?: any) {
  const data = [
    {
      name: 'Dr Hababou Danielle',
      label: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.863699,
      lng: 2.4833,
      distance: '56m',
    },
    {
      name: 'Grégoire Chardin',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.864699,
      lng: 2.4843,
      distance: '73m',
    },
    {
      name: 'Marcel Trouvé',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869699,
      lng: 2.4863,
      distance: '153m',
    },
    {
      name: 'Dr Adam Deslys',
      label: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.869599,
      lng: 2.4853,
      distance: '167m',
    },
    {
      name: 'Dr Roméo Magnier',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869699,
      lng: 2.4863,
      distance: '183m',
    },
    {
      name: 'Dr Marc Vandame',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869799,
      lng: 2.4873,
      distance: '192m',
    },
    {
      name: 'Dr Lucas Chappelle',
      label: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.869899,
      lng: 2.4883,
      distance: '321m',
    },
    {
      name: 'Frédéric Bescond',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869999,
      lng: 2.4893,
      distance: '424m',
    },
    {
      name: 'Henry Lacan',
      label: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.86999,
      lng: 2.4823,
      distance: '822m',
    },
  ];

  searchMapStore.setState({ loading: true });

  setTimeout(() => {
    searchMapStore.setState({ specialties: data, searchDoctor: [] });

    searchMapStore.setState({ loading: false });
  }, 3000);
}

export async function searchDoctor(variables) {
  if(variables.criteria.length < 3) {
    return null;
  }
  searchMapStore.setState({ loading: true, searchDoctor: [], specialties: [] });

  const { codesByLabel: { codes }} = await graphql.codesByLabel({
    apiKey: "12345",
    codeTypes: ["SP", "TYP"],
    first: 10,
    offset: 0,
    ...variables,
  })

  const data = codes ? codes.map(item => ({ label: item.longLbl, id: item.id })) : []

  return new Promise(resolve => {
    setTimeout(() => {
      searchMapStore.setState({ loading: false, searchDoctor: data });
      resolve(true)
    }, 500);
  })  
}
