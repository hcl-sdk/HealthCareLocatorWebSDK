type Theme = 'default' | 'green' | 'blue' | 'red' | 'purple' | 'custom';

interface Fields {
  apiKey: string;
  theme: Theme;
  homeMode: 'full' | 'min';
}
