import { searchMapStore } from "../stores"

export function getHCPNearMe() {
  const data = [
    {
      name: "Dr Hababou Danielle",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 45.257002,
      lng: 0.130000,
      distance: '56m'
    },
    {
      name: "Grégoire Chardin",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 50.328398,
      lng: 1.644700,
      distance: '73m'
    },
    {
      name: "Marcel Trouvé",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 48.869699,
      lng: 2.486300,
      distance: '153m'
    },
    {
      name: "Dr Adam Deslys",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 45.955002,
      lng: 0.166000,
      distance: '167m'
    },
    {
      name: "Dr Roméo Magnier",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 50.836398,
      lng: 1.614700,
      distance: '183m'
    },
    {
      name: "Dr Marc Vandame",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 48.266699,
      lng: 2.483700,
      distance: '192m'
    },
    {
      name: "Dr Lucas Chappelle",
      gp: "General Practitioner",
      address: "13 Rue Tronchet, 75008 Paris",
      createdAt: "3 days go",
      lat: 43.650002,
      lng: 0.160300,
      distance: '321m'
    },
    {
      name: "Frédéric Bescond",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 44.726398,
      lng: 1.614500,
      distance: '424m'
    },
    {
      name: "Henry Lacan",
      gp: "General Practitioner",
      address: "75008, Paris",
      createdAt: "5 minutes ago",
      lat: 49.866699,
      lng: 2.482300,
      distance: '822m'
    }
  ]

  searchMapStore.setState({ loading: true })

  setTimeout(() => {
    searchMapStore.setState({ hcpNearMe: data })

    searchMapStore.setState({ loading: false })
  }, 3000)
}
