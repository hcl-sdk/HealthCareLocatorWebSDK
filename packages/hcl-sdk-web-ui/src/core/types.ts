export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type Orientation = 'portrait' | 'landscape' | 'unknown';

export interface Breakpoint {
  screenWidth: number;
  screenSize: ScreenSize;
  orientation: Orientation;
}

export interface OptionType {
  label: string;
  value: string;
}

export interface GeolocCoordinates {
  latitude: number;
  longitude: number;
}

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

export type InitScreen = 'home' | 'search'
