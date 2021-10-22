import React, { useRef, useEffect, useMemo, CSSProperties } from 'react';
import { HclSdk } from './components';

export interface WidgetMap {
  specialties?: string[]
  medTerms?: string[]
  criteria?: string
  latitude?: number
  longitude?: number
  country?: string

  mapHeight?: string
  interactive?: boolean  // zoom + dragging
}

export type WidgetType = 'map'

export type WidgetProps = WidgetMap

type ConfigType = {
  apiKey: string;
  lang?: string;
  appName?: string;
  appURL?: string;
  showSuggestModification?: boolean;
  countries?: string;
  useGoogleMap?: boolean;
  googleMapApiKey?: string;
  enableDarkMode?: boolean;
  enableMapDarkMode?: boolean;
  enableMedicalTerm?: boolean
}

type HclSdkProps = {
  config: ConfigType
  className?: string;
  style?: CSSProperties;
  widget?: WidgetType
  widgetProps?: WidgetProps
} | {
  config?: ConfigType
  className?: string;
  style?: CSSProperties;
  widget: WidgetType
  widgetProps?: WidgetProps
}

const HclSdkComponent = (props: HclSdkProps) => {
  const ref = useRef<HTMLHclSdkElement>(null);
  const { config, className, style, widget, widgetProps } = props;

  useEffect(() => {
    customElements.whenDefined('hcl-sdk').then(function() {
      if (!ref.current) throw Error("ref is not assigned");
      if (config) {
        ref.current.init(config);
      }
    })
  })

  useEffect(() => {
    if (!ref.current) throw Error("ref is not assigned");

    ref.current.updateConfig(config);
  }, [config]);

  useEffect(() => {
    if (ref.current) {
      ref.current.widgetProps = widgetProps
    }
  }, [JSON.stringify(widgetProps)])

  useEffect(() => {
    if (ref.current) {
      ref.current.widget = widget
    }
  }, [widget])

  return useMemo(() => <HclSdk ref={ref} className={className} style={style} widget={widget} widgetProps={widgetProps} />, []);
};

export default HclSdkComponent;
