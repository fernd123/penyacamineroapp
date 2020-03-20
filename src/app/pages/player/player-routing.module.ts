import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerPage } from './player.page';
import { AuthGuard } from 'src/app/core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PlayerPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerPageRoutingModule { }
