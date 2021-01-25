import { OnekeySDKConfigInput, OnekeySDKConfig } from './types';
import { DEFAULT_CONFIGURATION } from './constants';

export function getFullConfiguration(configInput: OnekeySDKConfigInput): OnekeySDKConfig {
  return {
    ...DEFAULT_CONFIGURATION,
    ...configInput
  }
}
