export type Theme = 'default' | 'green' | 'blue' | 'red' | 'purple' | 'custom';

export interface Fields {
  apiKey: string;
  theme: Theme;
  lang: string;
  appName: string;
  appURL: string;
  showSuggestModification: boolean;
  countries: string[];
}
