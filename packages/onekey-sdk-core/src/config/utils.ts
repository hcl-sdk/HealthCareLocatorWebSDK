import { OnekeySDKConfigInput, OnekeySDKConfig } from './types';
import { DEFAULT_CONFIGURATION } from './constants';
import merge from 'lodash.merge';

export function getFullConfiguration(configInput: OnekeySDKConfigInput): OnekeySDKConfig {
  return merge({}, DEFAULT_CONFIGURATION, configInput);
}
