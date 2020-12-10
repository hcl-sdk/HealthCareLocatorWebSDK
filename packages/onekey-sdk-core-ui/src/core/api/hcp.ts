import { searchMapStore } from '../stores';
import { GraphQLClient, gql } from 'graphql-request';

export function getHCPNearMe() {
  const data = [
    {
      name: 'Dr Hababou Danielle',
      gp: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.863699,
      lng: 2.4833,
      distance: '56m',
    },
    {
      name: 'Grégoire Chardin',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.864699,
      lng: 2.4843,
      distance: '73m',
    },
    {
      name: 'Marcel Trouvé',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869699,
      lng: 2.4863,
      distance: '153m',
    },
    {
      name: 'Dr Adam Deslys',
      gp: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.869599,
      lng: 2.4853,
      distance: '167m',
    },
    {
      name: 'Dr Roméo Magnier',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869699,
      lng: 2.4863,
      distance: '183m',
    },
    {
      name: 'Dr Marc Vandame',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869799,
      lng: 2.4873,
      distance: '192m',
    },
    {
      name: 'Dr Lucas Chappelle',
      gp: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 48.869899,
      lng: 2.4883,
      distance: '321m',
    },
    {
      name: 'Frédéric Bescond',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.869999,
      lng: 2.4893,
      distance: '424m',
    },
    {
      name: 'Henry Lacan',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.86999,
      lng: 2.4823,
      distance: '822m',
    },
  ];

  searchMapStore.setState({ loading: true });

  setTimeout(() => {
    searchMapStore.setState({ hcpNearMe: data });

    searchMapStore.setState({ loading: false });
  }, 3000);
}

export async function searchDoctor() {
  const data = [
    {
      gp: "General Practitioner",
      label: 'General Practitioner',
      id: "1",
    },
    {
      gp: "General Doctor",
      label: 'Cardiologist',
      id: "2",
    },
    {
      gp: "General Skin",
      label: 'General practitioner, 75008...',
      id: "3",
      type: "history"
    },
    {
      gp: "General Lung",
      label: 'General practitioner, 75008...',
      id: "4",
      type: "history"
    }
  ]

  searchMapStore.setState({ loading: true, searchDoctor: [], searchGeo: [] });

  return new Promise(resolve => {
    setTimeout(() => {
      searchMapStore.setState({ searchDoctor: data });
  
      searchMapStore.setState({ loading: false });
      resolve()
    }, 1000);
  })
}

export const test = (variables = {}) => {
  const query = gql`
    query {
      activities(apiKey: "12345", criteria: "Tai", specialties: ["Tai1", "Tai2"]) {
        distance
        relevance
        activity {
          id
          title {
            label
            key
          }
          lastUpdateDate
          individual {
            id
            title
            lastName
          }
          workplace {
            id
            name
            lastUpdateDate
          }
        }
      }
    }
  `;

  const endpoint = 'https://apim-dev-eastus-onekey.azure-api.net/api/graphql/query';
  const client = new GraphQLClient(endpoint, { mode: 'no-cors' });
  return client.request(query, variables).then(data => console.log(data));
};
