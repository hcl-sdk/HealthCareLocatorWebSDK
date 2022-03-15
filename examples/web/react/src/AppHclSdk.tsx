// @ts-nocheck
import HclSdk from '@healthcarelocator/sdk-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useConfig } from './useConfig';

const mapSpecialtyByKey = {
  dentistry: {
    fr_FR: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentiste'
    },
    en: {
      specialtyCode: ['SP.WBE.72', 'SP.WBE.75', 'SP.WIT.75', 'SP.WDE.75'],
      specialtyLabel: 'Dentistry'
    }
  },
  cardiology: {
    fr_FR: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiologie'
    },
    en: {
      specialtyCode: ['SP.WBE.08', 'SP.WFR.AR', 'SP.WIT.08', 'SP.WCA.08', 'SP.WCA.08'],
      specialtyLabel: 'Cardiology'
    },
  },
};

// config change user location demo:
const demoUpdateUserGeolocation = false;

const locations = [
  { lat: 40.6976701, lng: -74.259864, label: 'New York' },
  { lat: 37.774929, lng: -122.419416, label: 'San Francisco' },
  { lat: 50.9519359, lng: 1.8339621, label: 'Paris' },
  { lat: 48.864716, lng: 2.349014, label: 'Calais, France' },
];

const SPECIALTY_CODE = 'SP.WUS.PHR';
const SPECIALTY_LABEL = 'PHARMACIST';
// end config change user location demo

export default function AppHclSdk() {
  const location = useLocation()
  const searchStr = new URLSearchParams(location.search).get('sp');
  const config = useConfig()
  const demoConfig = {
    ...config,
    entry: {
      screenName: 'searchNearMe',
      specialtyCode: [SPECIALTY_CODE],
      specialtyLabel: SPECIALTY_LABEL,
    },
  };
  const [currentPosition, setCurrentPosition] = useState(demoUpdateUserGeolocation ? locations[0] : undefined)

  useEffect(() => {
    if (searchStr) {
      const lang = config.lang || 'en'
      const key = searchStr
      const hclSdkEl = document.querySelector('hcl-sdk') as any;

      if (hclSdkEl && mapSpecialtyByKey[key] && mapSpecialtyByKey[key][lang] && mapSpecialtyByKey[key][lang].specialtyCode) {
        hclSdkEl.searchNearMe({
          specialtyCode: mapSpecialtyByKey[key][lang].specialtyCode,
          specialtyLabel: mapSpecialtyByKey[key][lang].specialtyLabel || ''
        });
      }
    }
  }, [searchStr, config])

  return demoUpdateUserGeolocation ? (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ padding: 8 }}>
        <select onChange={e => setCurrentPosition(JSON.parse(e.target.value))}>
          {locations.map(location => (
            <option key={location.label} value={JSON.stringify({ lat: location.lat, lng: location.lng })}>
              {location.label}
            </option>
          ))}
        </select>
      </div>
      <HclSdk config={demoConfig} currentPosition={currentPosition} />
    </div>
  ) : (
    <HclSdk config={config} />
  )
}
