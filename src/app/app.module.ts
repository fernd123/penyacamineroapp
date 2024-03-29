/* CORE */
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

/* FIREBASE */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireStorageModule } from '@angular/fire/storage';

/* TRANSLATE */
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlayerService } from './services/player.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatchService } from './services/match.service';
import { AuthGuard } from './core/auth.guard';
import { UserService } from './services/user.service';
import { MatchStatisticsService } from './services/match-statistics.service';


// importar locales
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { FirebaseStorageService } from './services/firebase-storage.service';

// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeEs, 'es');


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}

export const firebaseConfig = {
  apiKey: "AIzaSyBEk3ovFLldKX1hdPPjvFVnqUTiPXF6qwI",
  authDomain: "camineroheroapp.firebaseapp.com",
  databaseURL: "https://camineroheroapp.firebaseio.com",
  projectId: "camineroheroapp",
  storageBucket: "camineroheroapp.appspot.com",
  messagingSenderId: "937204455264",
  appId: "1:937204455264:web:eea709ccc7eb9025d47005",
  measurementId: "G-P4Y1RK62V6"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SharedModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
    AuthGuard,
    PlayerService, MatchService, MatchStatisticsService, UserService, FirebaseStorageService
  ],
  bootstrap: [AppComponent,
  ]
})
export class AppModule { }
