import { searchMapStore } from '../stores';
import { GraphQLClient, gql } from 'graphql-request';

export function getHCPNearMe() {
  const data = [
    {
      name: 'Dr Hababou Danielle',
      gp: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 45.257002,
      lng: 0.13,
      distance: '56m',
    },
    {
      name: 'Grégoire Chardin',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 50.328398,
      lng: 1.6447,
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
      lat: 45.955002,
      lng: 0.166,
      distance: '167m',
    },
    {
      name: 'Dr Roméo Magnier',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 50.836398,
      lng: 1.6147,
      distance: '183m',
    },
    {
      name: 'Dr Marc Vandame',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 48.266699,
      lng: 2.4837,
      distance: '192m',
    },
    {
      name: 'Dr Lucas Chappelle',
      gp: 'General Practitioner',
      address: '13 Rue Tronchet, 75008 Paris',
      createdAt: '3 days go',
      lat: 43.650002,
      lng: 0.1603,
      distance: '321m',
    },
    {
      name: 'Frédéric Bescond',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 44.726398,
      lng: 1.6145,
      distance: '424m',
    },
    {
      name: 'Henry Lacan',
      gp: 'General Practitioner',
      address: '75008, Paris',
      createdAt: '5 minutes ago',
      lat: 49.866699,
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

  const endpoint = 'https://dev-eastus-onekey-sdk-apim.azure-api.net/api/graphql/query';
  const client = new GraphQLClient(endpoint, { mode: 'no-cors' });
  return client.request(query, variables).then(data => console.log(data));
};
