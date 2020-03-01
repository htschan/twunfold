import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { APP_CONFIG_DI, APP_CONFIG_VAL } from 'src/twappconfig';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

/*
export const APP_CONFIG_VAL: IAppConfig = {

  TwUrl: 'https://someurl.com',
  Tk1: 'xxxxxxx-yyyy-yyyy-yyyy-xxxxxxxxx',
  Tk2: 'xxxxxxx-yyyy-yyyy-yyyy-xxxxxxxxx'
};
*/

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: APP_CONFIG_DI, useValue: APP_CONFIG_VAL },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
