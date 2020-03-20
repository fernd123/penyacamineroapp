import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderPage } from './components/header/header.page';
import { PlayerService } from '../services/player.service';
import { PlayerSavePage } from '../pages/player/save/player-save.page';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, "./../../assets/i18n/", ".json");
}

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })],
    declarations: [HeaderPage, PlayerSavePage],
    entryComponents: [PlayerSavePage],
    providers: [PlayerService],
    exports: [
        CommonModule, FormsModule,
        ReactiveFormsModule, TranslateModule,
        HeaderPage
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}