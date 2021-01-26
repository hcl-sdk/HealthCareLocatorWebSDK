import { graphql } from 'onekey-sdk-core';
import { QueryActivityByIdArgs, QueryCodesByLabelArgs, QueryIndividualByIdArgs } from 'onekey-sdk-core/src/graphql/types';
import { OnekeyAPIConfig } from './onekey-types';


export class OnekeySDKApi {
  private readonly _options: OnekeyAPIConfig;

  constructor(option: OnekeyAPIConfig) {
    this._options = { ...option };
  }

  get options(): OnekeyAPIConfig {
    return this._options;
  }

  get config() {
    return {
      headers: {
        'Ocp-Apim-Subscription-Key': this.options.apiKey
      }
    }
  }

  activityByID(params: QueryActivityByIdArgs) {
    return graphql.activityByID(params, this.config);
  }

  individualsByID(params: QueryIndividualByIdArgs) {
    return graphql.individualsByID(params, this.config);
  }

  codesByLabel(params: QueryCodesByLabelArgs) {
    return graphql.codesByLabel(params, this.config);
  }
}