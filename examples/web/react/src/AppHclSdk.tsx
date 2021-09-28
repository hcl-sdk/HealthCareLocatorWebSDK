import HclSdk from '@healthcarelocator/sdk-react';
import { useEffect } from 'react';
import { useLocation } from "react-router"

function getSettingsFromLocal() {
  const settingsStr = localStorage.getItem(`__hcl-sdk-dev-settings-fields`);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr);
    } catch (err) { }
  }
  return {
    apiKey: '',
    appName: 'Carenity',
    appURL: 'https://apps.apple.com/fr/app/carenity/id1404422803'
  };
}

function getSettingsCustomIconFromLocal() {
  const settingsStr = localStorage.getItem('__hclsdk-devtools-custom-icon');
  if (settingsStr) {
    try {
      return { icons: JSON.parse(settingsStr) }
    } catch (err) { }
  }
  return { icons: {} }
}

const config = {
  ...getSettingsFromLocal(),
  ...getSettingsCustomIconFromLocal()
};

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
    }
  }
}

export default function AppHclSdk() {
  const location = useLocation()
  const searchStr = new URLSearchParams(location.search).get('sp');
  
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
  }, [searchStr])

  return (
    <HclSdk config={config}/>
  )
}