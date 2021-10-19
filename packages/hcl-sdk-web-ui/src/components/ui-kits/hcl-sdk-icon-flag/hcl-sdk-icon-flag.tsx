import { Component, Prop } from '@stencil/core';
import { CountryCode } from '../../../core/constants';

import BE from './BE'
import CA from './CA'
import CO from './CO'
import DE from './DE'
import ES from './ES'
import FR from './FR'
import GB from './GB'
import IT from './IT'
import NL from './NL'
import PL from './PL'
import PT from './PT'
import SA from './SA'
import TR from './TR'
import US from './US'
// import DU from './DU'

const mapFlags = { BE, CA, CO, DE, ES, FR, GB, IT, NL, PL, PT, SA, TR, US }

@Component({
  tag: 'hcl-sdk-icon-flag',
  shadow: false,
})

export class HclSdkIcon {
  @Prop() countryCode: CountryCode

  render() {
    return  typeof mapFlags[this.countryCode] === 'function' ? mapFlags[this.countryCode]() : null
  }
}