import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerPageRoutingModule } from './player-routing.module';

import { PlayerPage } from './player.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlayerSavePage } from './save/player-save.page';
import { MatchSavePage } from '../match/save/match-save.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerPageRoutingModule,
    SharedModule
  ],
  entryComponents: [],
  declarations: [PlayerPage]
})
export class PlayerPageModule { }
