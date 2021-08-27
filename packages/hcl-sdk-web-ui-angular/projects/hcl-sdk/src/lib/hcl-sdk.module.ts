import { NgModule } from '@angular/core';
import { HclSdk } from '../directives/proxies';
import { defineCustomElements } from '@healthcarelocator/sdk-web/dist/loader';
import { HclSdkComponent } from './hcl-sdk.components';

defineCustomElements(window);

@NgModule({
  declarations: [HclSdk, HclSdkComponent],
  imports: [],
  exports: [HclSdkComponent],
})
export class HclSdkModule {}
