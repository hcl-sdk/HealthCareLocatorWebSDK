type Theme = 'green' | 'blue' | 'red' | 'purple' | 'custom';

interface CustomThemeFields {
  font: string;
  fontSizeBase: string;
  fontSizeTitle: string;
  colorPrimary: string;
  colorSecondary: string;
  colorMarker: string;
  colorMarkerSelected: string;
};

interface Fields {
  apiKey: string;
  theme: Theme;
  customTheme: CustomThemeFields;
}
