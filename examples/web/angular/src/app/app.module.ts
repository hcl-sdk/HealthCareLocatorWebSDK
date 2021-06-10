import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HclSdkModule } from 'hcl-sdk';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HclSdkModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
