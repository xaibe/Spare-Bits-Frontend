import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFireAuthModule } from '@angular/fire/auth';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorInterceptor } from 'src/sdk/core/httpinterceptor.service';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/Camera/ngx';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// const config = {
//    apiKey: "AIzaSyCpvvwHFkyBF1JdKPJDYIaYvKe60sy9Lqc",
//    authDomain: "sparebits-a2638.firebaseapp.com",
//    projectId: "sparebits-a2638",
//    storageBucket: "sparebits-a2638.appspot.com",
//    messagingSenderId: "392880281736",
//    appId: "1:392880281736:web:da80c648db2b54d77c673d"
//  };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
   // AngularFireModule.initializeApp(config),
  // AngularFireAuthModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,Camera,
    SplashScreen,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
