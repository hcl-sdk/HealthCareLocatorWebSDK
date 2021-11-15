import HclSdk from '@healthcarelocator/sdk-react';
import { useEffect } from 'react';
import { useLocation } from "react-router"
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
    }
  }
}

export default function AppHclSdk() {
  const location = useLocation()
  const searchStr = new URLSearchParams(location.search).get('sp');
  const config = useConfig()

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

  return (
    <HclSdk config={config} />
  )
}