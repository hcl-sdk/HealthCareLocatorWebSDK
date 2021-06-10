import HclSdk from 'hcl-sdk-web-ui-react';
import { useEffect, useState } from 'react';
import './App.scss';

const Fields = {
  apiKey: '',
  lang: '',
  appName: '',
  appURL: '',
  showSuggestModification: false,
  countries: [],
  useGoogleMap: false,
  googleMapApiKey: '',
} as const;

const FieldName = {
  apiKey: 'API Key',
  lang: 'Lang',
  appName: 'App Name',
  appURL: 'App URL',
  showSuggestModification: 'Show Suggestion Modification',
  countries: 'Countries',
  useGoogleMap: 'Use Google Map',
  googleMapApiKey: 'Google Map API Key',
};

function SettingField({ fieldName, fieldValue, onChange }) {
  const booleanFields = ['showSuggestModification', 'useGoogleMap'];

  return (
    <label htmlFor={fieldName} className="setting-field">
      {FieldName[fieldName]}
      <input
        id={fieldName}
        name={fieldName}
        type={booleanFields.includes(fieldName) ? 'checkbox' : 'text'}
        value={fieldValue}
        checked={fieldValue}
        className="setting-input"
        onChange={e => {
          let value;
          if (booleanFields.includes(fieldName)) {
            value = e.target.checked;
          } else if (fieldName === 'countries') {
            value = (e.target.value || '')
              .trim()
              .split(',')
              .filter(val => !!val);
          } else {
            value = e.target.value;
          }
          onChange({ fieldName, fieldValue: value });
        }}
      />
    </label>
  );
}

function Devtools(props) {
  const { applyConfig, config } = props;
  const [tmpConfig, changeConfig] = useState(config);
  const [changed, markChanged] = useState(false);

  const onChange = ({ fieldName, fieldValue }) => {
    markChanged(true);
    changeConfig(prev => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onSubmit = (e) => {
    applyConfig(tmpConfig)
    markChanged(false);
    e.preventDefault();
  }

  const formDisabled = (tmpConfig.useGoogleMap && !tmpConfig.googleMapApiKey) || !changed;

  return (
    <form className="dev-settings"  onSubmit={onSubmit} >
      {tmpConfig.useGoogleMap && !tmpConfig.googleMapApiKey ? <div className="error">Google Map API Key required.</div> : null}
      {Object.entries(tmpConfig).map(([fieldName, fieldValue]) => (
        <SettingField key={fieldName} fieldName={fieldName} fieldValue={fieldValue} onChange={onChange} />
      ))}
      <input type="submit" disabled={formDisabled}/>
    </form>
  );
}

const getConfigFromLocalStorage = () => {
  const savedConfig = localStorage.getItem('__react_settings');
  return savedConfig ? JSON.parse(savedConfig) : Fields;
};

function App() {
  const [config, applyConfig] = useState(getConfigFromLocalStorage());

  useEffect(() => {
    localStorage.setItem('__react_settings', JSON.stringify(config));
  }, [config]);

  return (
    <div className="App" style={{ width: '100%', height: '100vh' }}>
      <HclSdk
        className="custom-sdk"
        config={{
            ...config,
            useGoogleMap: config.useGoogleMap && config.googleMapApiKey,
          }}
      />
      <Devtools config={config} applyConfig={applyConfig} />
    </div>
  );
}

export default App;
