import React, { useRef, useEffect, useMemo, CSSProperties } from 'react';
import { HclSdk } from './components';

interface HclSdkProps {
  config: {
    apiKey: string;
    lang?: string;
    appName?: string;
    appURL?: string;
    showSuggestModification?: boolean;
    countries?: string;
    useGoogleMap?: boolean;
    googleMapApiKey?: string;
  }
  className?: string;
  style?: CSSProperties
}

const HclSdkComponent = (props: HclSdkProps) => {
  const ref = useRef<HTMLHclSdkElement>(null);
  const { config, className, style } = props;

  useEffect(() => {
    customElements.whenDefined('hcl-sdk').then(function() {
      if (!ref.current) throw Error("ref is not assigned");

      ref.current.init(config);
    })
  })

  useEffect(() => {
    if (!ref.current) throw Error("ref is not assigned");

    ref.current.updateConfig(config);
  }, [config]);

  return useMemo(() => <HclSdk ref={ref} className={className} style={style} />, []);
};

export default HclSdkComponent;
