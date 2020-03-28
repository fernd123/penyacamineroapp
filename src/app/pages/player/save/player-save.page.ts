import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { Player } from 'src/app/models/player.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';
import { getDate } from 'src/app/models/parent.model';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { finalize, map } from 'rxjs/operators';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

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
  public segment: string = 'general';
  private loading: any = null;


  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;

  constructor(
    private photoViewer: PhotoViewer,
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    private playerService: PlayerService,
    private translateService: TranslateService,
    private loadingCtrl: LoadingController,
    public toastController: ToastController,
    private firebaseStorage: FirebaseStorageService,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.title = this.currentPlayer == undefined ? 'player.newPlayer' : 'player.editPlayer';
    this.playerForm = this.buildFormGroup();
    this.getLoading();
  }

  private async getLoading() {
    this.loading = await this.loadingCtrl.create({
      message: this.translateService.instant('saving')
    });
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
      profileImage: [player != undefined ? player.profileImage : '', null],
      //atributes
      pace: [player != undefined ? player.pace : 0, null],
      shooting: [player != undefined ? player.shooting : 0, null],
      passing: [player != undefined ? player.passing : 0, null],
      dribbling: [player != undefined ? player.dribbling : 0, null],
      defending: [player != undefined ? player.defending : 0, null],
      physical: [player != undefined ? player.physical : 0, null],
      average: [player != undefined ? player.physical : 0, null]
    });
  }

  async onSubmit() {
    this.loading.present();
    const updateFile = await this.updateFile();
    if (updateFile != null) {
      let referencia = this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo);
      referencia.getDownloadURL().subscribe(URL => {
        this.loading.dismiss();
        this.updatePlayer(URL);
      });
    } else {
      this.loading.dismiss();
      this.updatePlayer(null);
    }
  }

  private updatePlayer(url: string) {
    let player: Player = this.createFromForm();
    player.profileImage = url == null ? player.profileImage : url;
    if (this.currentPlayer == undefined) {
      this.playerService.addPlayer(player).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('player.saveSuccess'),
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.close();
      }, error => { console.log(error) });
    } else {
      let playerId = this.myProfile == true ? localStorage.getItem('playerId') : this.currentPlayer.id;
      this.playerService.updatePlayer(playerId, player).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('player.updateSuccess'),
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.close();
      }, error => { console.log(error) });
    }
  }

  private createFromForm(): Player {
    let formValue: any = this.playerForm.value;
    formValue.creationDate = getDate();
    let average: number = 0;
    average += formValue.pace;
    average += formValue.shooting;// != '' ? formValue.shooting : 0;
    average += formValue.passing;// != '' ? formValue.passing : 0;
    average += formValue.dribbling;// != '' ? formValue.dribbling : 0;
    average += formValue.defending;// != '' ? formValue.defending : 0;
    average += formValue.physical;// != '' ? formValue.physical : 0;
    average = average / 6;
    formValue.average = average;
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

  //Evento que se gatilla cuando el input de tipo archivo cambia
  public changeFile(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public async updateFile() {
    let url = "";
    let archivo = this.datosFormulario.get('archivo');
    if (archivo == null) {
      return null;
    }
    let tarea = this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo);

    return tarea;
  }

  public showProfileImage() {
    this.photoViewer.show(this.currentPlayer.profileImage);
  }
}
