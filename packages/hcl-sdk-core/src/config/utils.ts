import { HclSDKConfigInput, HclSDKConfig } from './types';
import { DEFAULT_CONFIGURATION } from './constants';

export function getFullConfiguration(configInput: HclSDKConfigInput): HclSDKConfig {
  return {
    ...DEFAULT_CONFIGURATION,
    ...configInput
  }
}
