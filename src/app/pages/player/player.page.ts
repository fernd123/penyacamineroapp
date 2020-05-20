import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { PlayerSavePage } from './save/player-save.page';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  public title: string = 'players';
  private selectedCard: any;
  public playerList: Observable<Player[]>;

  constructor(
    public modalController: ModalController,
    public playerService: PlayerService,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    let loading = await this.loadingCtrl.create({
      message: this.translateService.instant('loading')
    });
    loading.present();
    this.playerService.getPlayers().subscribe((res: any) => { });
    loading.dismiss();
  }

  ngAfterContentInit() {
  }

  async presentModal(player: Player, card: any) {
    debugger;
    let isUserAdmin = (localStorage.getItem('isUserAdmin') == "true");
    if (isUserAdmin) {
      if (card != undefined) {
        this.selectedCard != undefined ? this.selectedCard.el.style.background = '' : '';
        this.selectedCard = card;
        card.el.style.background = '#00a0406b';
      }
      const modal = await this.modalController.create({
        cssClass: "my-modal",
        component: PlayerSavePage,
        componentProps: {
          'currentPlayer': player
        }
      });
      return await modal.present();
    }
  }

  deletePlayer(id: string) {
    this.playerService.deletePlayer(id);
  }

  getPlayerPosition(player: Player) {
    switch (player.mainPosition) {
      case 'position.defense':
        return "DF";
      case 'position.midfilder':
        return "MC";
      case 'position.forward':
        return "FW";
    }
  }

  getProfileImage(player: Player, index: number) {
    if (player.profileImage != undefined) {
      return player.profileImage;
    } else {
      return "assets/images/ob/ob" + (index + 1) + ".png";
    }
  }
}
