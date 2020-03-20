import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlayerSavePage } from '../player/save/player-save.page';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  private title: string = 'home';

  constructor(
    public fAuth: AngularFireAuth,
    private router: Router,
    public modalController: ModalController,
    private playerService: PlayerService
  ) { }

  logout() {
    localStorage.removeItem('userId');
    this.fAuth.auth.signOut();
    return this.router.navigateByUrl('/login');
  }

  async showProfile() {
    const modal = await this.modalController.create({
      component: PlayerSavePage,
      componentProps: {
        'currentPlayer': new Player(),
        'myProfile': true
      }
    });
    this.playerService.getPlayerById(localStorage.getItem('playerId')).then(function (doc) {
      if (doc.exists) {
        modal.componentProps.currentPlayer = doc.data();
        modal.present();
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });




  }



}
