export type Theme = 'default' | 'green' | 'blue' | 'red' | 'purple' | 'custom';

export interface Fields {
  apiKey: string;
  theme: Theme;
  lang: string;
  appName: string;
  appURL: string;
  showSuggestModification: boolean;
  enableDarkMode?: boolean;
  enableMapDarkMode?: boolean;
  enableMedicalTerm?: boolean;
  countries: string[];
  useGoogleMap: boolean;
  googleMapApiKey?: string;
  googleMapId?: string;
  distanceUnit?: 'km' | 'mi';
  distanceDefault?: number;
}
