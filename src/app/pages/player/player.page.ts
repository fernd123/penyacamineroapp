import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlayerSavePage } from './save/player-save.page';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  private title: string = 'players';
  private selectedCard: any;
  public playerList: Observable<Player[]>;
  constructor(
    public modalController: ModalController,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.playerList = this.playerService.getPlayers();
  }

  async presentModal(player: Player, card: any) {
    if (card != undefined) {
      this.selectedCard != undefined ? this.selectedCard.el.style.background = '' : '';
      this.selectedCard = card;
      card.el.style.background = '#00a0406b';
    }
    const modal = await this.modalController.create({
      component: PlayerSavePage,
      componentProps: {
        'currentPlayer': player
      }
    });
    return await modal.present();
  }

  deletePlayer(id: string) {
    this.playerService.deletePlayer(id);
  }

}
