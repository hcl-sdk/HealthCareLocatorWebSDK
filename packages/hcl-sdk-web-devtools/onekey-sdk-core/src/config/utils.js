import { DEFAULT_CONFIGURATION } from './constants';
export function getFullConfiguration(configInput) {
  return Object.assign(Object.assign({}, DEFAULT_CONFIGURATION), configInput);
}
