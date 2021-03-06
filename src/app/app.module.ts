import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';


import { MapComponent } from '../components/map/map';
import { Push } from '@ionic-native/push';
import { DeviceOrientation } from '@ionic-native/device-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    
    
    MapComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),

    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    Push,
    DeviceOrientation,
    AndroidPermissions,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    Geolocation
  ]
})
export class AppModule {}
