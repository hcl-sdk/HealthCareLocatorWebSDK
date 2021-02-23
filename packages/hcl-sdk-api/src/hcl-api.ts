import { graphql } from 'hcl-sdk-core';
import { QueryActivityByIdArgs, QueryCodesArgs, QueryIndividualByIdArgs } from 'hcl-sdk-core/src/graphql/types';
import { HclAPIConfig } from './hcl-types';


export class HclSDKApi {
  private readonly _options: HclAPIConfig;

  constructor(option: HclAPIConfig) {
    this._options = { ...option };
  }

  get options(): HclAPIConfig {
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

  codesByLabel(params: QueryCodesArgs) {
    return graphql.codesByLabel(params, this.config);
  }

  labelsByCode(params: QueryCodesArgs) {
    return graphql.labelsByCode(params, this.config);
  }
}
