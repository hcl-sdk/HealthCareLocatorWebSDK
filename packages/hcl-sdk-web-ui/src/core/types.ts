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
