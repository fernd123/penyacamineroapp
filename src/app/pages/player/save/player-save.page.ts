import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Player } from 'src/app/models/player.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { getDate } from 'src/app/models/parent.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-player-save',
  templateUrl: './player-save.page.html',
  styleUrls: ['./player-save.page.scss']
})
export class PlayerSavePage implements OnInit {

  @Input() currentPlayer: Player;
  @Input() myProfile: boolean;

  public playerForm: FormGroup;
  private title: string;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    private playerService: PlayerService,
    private translateService: TranslateService,
    public toastController: ToastController,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.title = this.currentPlayer == undefined ? 'player.newPlayer' : 'player.editPlayer';
    this.playerForm = this.buildFormGroup();
  }

  protected buildFormGroup(): FormGroup {
    let player: Player = this.currentPlayer != undefined ? this.currentPlayer : new Player();
    return this.formBuilder.group({
      id: [player != undefined ? player.id : '', null],
      firstname: [player != undefined ? player.firstname : '', Validators.required],
      lastname: [player != undefined ? player.lastname : '', Validators.required],
      nickname: [player != undefined ? player.nickname : '', null],
      birthday: [player != undefined ? player.birthday : '', Validators.required],
      mainPosition: [player != undefined ? player.mainPosition : '', Validators.required],
      secondPosition: [player != undefined ? player.secondPosition : '', null],
      thirdPosition: [player != undefined ? player.thirdPosition : '', null],
      leg: [player != undefined ? player.leg : '', Validators.required],
      status: [player != undefined ? player.status : '', Validators.required],
      active: [player != undefined ? player.active : true, null],
      profileImage: [player != undefined ? player.profileImage : '', null]
    });
  }

  onSubmit() {
    let player: Player = this.createFromForm();
    if (this.currentPlayer == undefined) {
      this.playerService.addPlayer(player).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('player.saveSuccess'),
          duration: 2000
        });
        toast.present();
        this.close();
      }, error => { console.log(error) });
    } else {
      let playerId = this.myProfile == true ? localStorage.getItem('playerId') : this.currentPlayer.id;
      this.playerService.updatePlayer(playerId, player).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('player.updateSuccess'),
          duration: 2000
        });
        toast.present();
        this.close();
      }, error => { console.log(error) });
    }
  }

  private createFromForm(): Player {
    let formValue: any = this.playerForm.value;
    formValue.creationDate = getDate();
    return formValue;
    /*let player: Player = new Player();
    player.id = formValue.id;
    player.firstname = formValue.firstname;
    player.lastname = formValue.lastname;
    player.nickname = formValue.nickname;
    player.age = formValue.age;
    player.status = formValue.status;
    player.leg = formValue.leg;
    player.mainPosition = formValue.mainPosition;
    player.nickname = formValue.nickname;
    player.secondPosition = formValue.secondPosition;
    player.thirdPosition = formValue.thirdPosition;
    player.profileImage = formValue.profileImage;
    return player;*/
  }
  close() {
    this.modalController.dismiss();
  }
}
