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

import AU from './AU'
import AT from './AT'
import HR from './HR'
import GR from './GR'
import IL from './IL'
import MA from './MA'
import SE from './SE'
import CH from './CH'
import TH from './TH'

import BG from './BG'
import BR from './BR'
import DK from './DK'
import FI from './FI'
import HU from './HU'
import IE from './IE'

import KR from './KR'
import LU from './LU'
import NO from './NO'
import NZ from './NZ'
import SK from './SK'

// import DU from './DU'

const mapFlags = {
  BE,
  CA,
  CO,
  DE,
  ES,
  FR,
  GB,
  UK: GB,
  IT,
  NL,
  PL,
  PT,
  SA,
  TR,
  US,
  AU,
  AT,
  HR,
  BK: HR,
  GR,
  IL,
  MA,
  SE,
  CH,
  TH,
  BG,
  BR,
  DK,
  FI,
  HU,
  IE,
  KR,
  LU,
  NO,
  NZ,
  SK,
};

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