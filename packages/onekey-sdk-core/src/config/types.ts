import { Complete } from '../types';

export interface OnekeySDKConfigInput {
  apiKey: string;
}

export type OnekeySDKConfig = Complete<OnekeySDKConfigInput>;
