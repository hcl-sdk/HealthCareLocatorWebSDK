import { Complete } from '../types';

export interface HclSDKConfigInput {
  apiKey: string;
}

export type HclSDKConfig = Complete<HclSDKConfigInput>;
