import { graphql } from '../../hcl-sdk-core';
import {
  QueryActivitiesArgs,
  QueryActivityByIdArgs,
  QueryCodesByLabelArgs,
  QueryIndividualByIdArgs
} from '../../hcl-sdk-core/src/graphql/types';
import { ENDPOINT } from '../../hcl-sdk-core/src/graphql/constants';
import { HclAPIConfig } from './hcl-types';

const graphqlUrl = new URL(ENDPOINT);
const graphqlUrlOrigin = graphqlUrl.origin;

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

  activities(params: QueryActivitiesArgs) {
    return graphql.activities(params, this.config);
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

  labelsByCode(params: QueryCodesByLabelArgs) {
    return graphql.labelsByCode(params, this.config);
  }

  suggestModification(data) {
    const headers = Object.assign({
      'Content-Type': 'application/json'
    }, this.config.headers);

    return fetch(graphqlUrlOrigin + '/api/changerequest/modifieddata', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }
}
