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

/* FIREBASE */
import { firebaseConfig } from '../environments/firebaseConfig';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth'

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

// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeEs, 'es');


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}

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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
    AuthGuard,
    PlayerService, MatchService, MatchStatisticsService, UserService
  ],
  bootstrap: [AppComponent,
  ]
})
export class AppModule { }
