import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HclSdkModule } from '@healthcarelocator/sdk-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { DevToolComponent } from './dev-tool/dev-tool.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, SearchComponent, DevToolComponent],
  imports: [BrowserModule, HclSdkModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
