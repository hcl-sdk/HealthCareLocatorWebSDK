export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type Orientation = 'portrait' | 'landscape' | 'unknown';

export interface Breakpoint {
  screenSize: ScreenSize;
  orientation: Orientation;
}

export interface OptionType {
  label: string;
  value: string;
}
