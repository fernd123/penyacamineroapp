import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';

import { MatchPage } from './match.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatchSavePage } from './save/match-save.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchPageRoutingModule,
    SharedModule
  ],
  entryComponents: [MatchSavePage],
  declarations: [MatchPage, MatchSavePage]
})
export class MatchPageModule { }
