import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from 'src/app/models/match.model';
import { MatchService } from 'src/app/services/match.service';
import { getDate } from 'src/app/models/parent.model';
import { TranslateService } from '@ngx-translate/core';
import { MatchStatisticsService } from 'src/app/services/match-statistics.service';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-match-save',
  templateUrl: './match-save.page.html',
  styleUrls: ['./match-save.page.scss']
})
export class MatchSavePage implements OnInit {

  @Input() currentMatch: Match;
  public currentPlayer: any;
  public currentStatisticIndex: any;
  public matchForm: FormGroup;
  public statisticForm: FormGroup;
  public segment: string = 'info';
  public showPlayerStatistic: boolean = false;
  private title: string;
  public playerList: Observable<Player[]>;
  private loading: any = null;
  private currentPlayerId: string = "";

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private translateService: TranslateService,
    private matchService: MatchService,
    private playerService: PlayerService,
    private matchStatisticsService: MatchStatisticsService,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    this.currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
    this.currentPlayerId = localStorage.getItem('playerId');

    this.playerList = this.playerService.getPlayers();
    this.title = this.currentMatch == undefined ? 'match.newMatch' : 'match.editMatch';
    this.matchForm = this.buildFormGroup();
    this.statisticForm = this.buildFormGroupStatistics();
    this.getLoading();
  }

  private async getLoading() {
    this.loading = await this.loadingCtrl.create({
      message: this.translateService.instant('saving')
    });
  }

  protected buildFormGroup(): FormGroup {
    let match: Match = this.currentMatch != undefined ? this.currentMatch : new Match();
    this.currentMatch == undefined ? match.active = false : "";
    return this.formBuilder.group({
      id: [match != undefined ? match.id : '', null],
      initHour: [match != undefined ? match.initHour : '', Validators.required],
      endHour: [match != undefined ? match.endHour : '', Validators.required],
      date: [match != undefined ? match.date : '', Validators.required],
      place: [match != undefined ? match.place : '', null],
      type: [match != undefined ? match.type : 'match.typeF.5', Validators.required],
      localGoals: [match != undefined ? match.localGoals : '', null],
      awayGoals: [match != undefined ? match.awayGoals : '', null],
      lineUpLocal: [match != undefined ? match.lineUpLocal : ''],
      lineUpAway: [match != undefined ? match.lineUpAway : ''],
      active: [match != undefined ? match.active : false, null],
      statistics: [match != undefined ? match.statistics : [], null]
    });
  }

  protected buildFormGroupStatistics(): FormGroup {
    let goals = null;
    let assists = null;

    if (this.currentMatch != undefined && this.currentMatch.statistics != undefined)
      this.currentMatch.statistics.forEach(s => {
        if (s.playerId == this.currentPlayerId) {
          goals = s.goals;
          assists = s.assists;
          return;
        }
      });
    return this.formBuilder.group({
      matchId: ['', null],
      playerId: ['', null],
      goals: [goals, [Validators.required, Validators.min(0)]],
      assists: [assists, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    this.loading.present();
    let match: Match = this.createFromForm();
    if (this.currentMatch == undefined) {
      this.matchService.addMatch(match).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('match.saveSuccess'),
          duration: 2000,
          color: 'success'
        });
        this.loading.dismiss();
        toast.present();
        this.close();
      }, error => { console.log(error) });
    } else {
      this.matchService.updateMatch(this.currentMatch.id, match).then(async res => {
        const toast = await this.toastController.create({
          message: this.translateService.instant('match.updateSuccess'),
          duration: 2000,
          color: 'success'
        });
        this.loading.dismiss();
        toast.present();
        this.close();
      }, error => { console.log(error) });
    }
  }

  private createFromForm(): Match {
    let formValue: any = this.matchForm.value;
    formValue.creationDate = getDate();
    this.currentMatch == undefined ? formValue.statistics = [] : this.currentMatch.statistics;
    return formValue;
  }

  close() {
    this.modalController.dismiss();
  }

  getSignInButtonText() {
    if (this.currentMatch != undefined && this.isUserSignedInConvocation()) {
      return 'match.signInYet';
    } else if (this.currentMatch != undefined && this.currentMatch.statistics.length == 10) {
      return 'match.convocationClosed';
    } else if (this.currentMatch == undefined || this.currentMatch.statistics.length <= 9) {
      return 'match.signIn';
    }
  }

  isUserSignedInConvocation() {
    let playerLoged = localStorage.getItem('playerId');
    let inConvocation = false;
    if (this.currentMatch != undefined && this.currentMatch.statistics != undefined)
      this.currentMatch.statistics.forEach(p => {
        if (p.playerId == playerLoged) {
          inConvocation = true;
        }
      });
    return inConvocation;
  }

  checkIfPlayerIsCurrentPlayer(playerId: string) {
    let playerLoged = localStorage.getItem('playerId');
    if (playerId == playerLoged) {
      return true;
    }
    return false;
  }

  async signInConvocation() {
    let currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
    this.currentMatch.statistics.push({ playerId: localStorage.getItem('playerId'), playerName: `${currentPlayer.firstname} ${currentPlayer.lastname}`, assists: 0, goals: 0 });
    this.matchService.updateMatch(this.currentMatch.id, this.currentMatch).then(async res => {
      const toast = await this.toastController.create({
        message: this.translateService.instant('match.convocationSuccess'),
        duration: 2000,
        color: 'success'
      });
      toast.present();
    })
  }

  showIfUserIsAdmin() {
    let isUserAdmin = (localStorage.getItem('isUserAdmin') == "true");
    return isUserAdmin;
  }

  async signOutConvocation(statistic: any) {
    let statisticIdxRemove: number = 0;
    // Delete statistics
    for (let i = 0; i < this.currentMatch.statistics.length; i++) {
      if (this.currentMatch.statistics[i].playerId == statistic.playerId) {
        statisticIdxRemove = i;
      }
    }

    // Delete the player from convocation
    this.currentMatch.statistics.splice(statisticIdxRemove, 1);

    this.matchService.updateMatch(this.currentMatch.id, this.currentMatch).then(res => {
      //Delete the match player statistics
      this.matchStatisticsService.getStatisticsByMatch(this.currentMatch.id).then(async snapshot => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            if (doc.data().playerId == statistic.playerId) {
              this.matchStatisticsService.deleteMatchStatistic(doc.id);
            }
          });
          this.statisticForm.reset();
          const toast = await this.toastController.create({
            message: this.translateService.instant('match.signOutSuccess'),
            duration: 2000,
            color: 'success'
          });
          toast.present();
        } else {
          this.statisticForm.reset();
          const toast = await this.toastController.create({
            message: this.translateService.instant('match.signOutSuccess'),
            duration: 2000,
            color: 'success'
          });
          toast.present();
        }
      })
    })
  }

  showStatistics(statistic: any, index: number) {
    if (this.currentMatch.statistics != undefined &&
      (this.showIfUserIsAdmin() || this.checkIfPlayerIsCurrentPlayer(statistic.playerId))) {
      this.currentPlayer = statistic.playerId;
      this.showPlayerStatistic = !this.showPlayerStatistic;
      this.currentStatisticIndex = index;
      this.statisticForm.get('goals').setValue(this.currentMatch.statistics[index].goals);
      this.statisticForm.get('assists').setValue(this.currentMatch.statistics[index].assists);
      /*
            this.currentMatch.statistics.forEach(s => {
              if (s.playerId == statistic.playerId) {
                this.currentStatisticIndex = index;
                this.statisticForm.get('goals').setValue(s.goals);
                this.statisticForm.get('assists').setValue(s.assists);
                return;
              }
            })
            */
    }
  }

  async saveStatistics() {
    let updateMatch = this.setStatistics();
    if (updateMatch) {
      this.matchService.updateMatch(this.currentMatch.id, this.currentMatch).then(async res => {
        this.showPlayerStatistic = !this.showPlayerStatistic;
        const toast = await this.toastController.create({
          message: this.translateService.instant('match.statisticsSuccess'),
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.close();
      });
    } else {
      const toast = await this.toastController.create({
        message: this.translateService.instant('match.noConvocationPlayerError'),
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  private setStatistics() {
    let statistics: any = {};

    if (this.currentMatch.statistics.length == 0) {
      return false;
    }
    this.currentMatch.statistics.forEach(s => {
      if (s.playerId == this.currentPlayerId) {
        statistics = s;
        return false;
      }
    });

    statistics.matchId = this.currentMatch.id;
    statistics.playerId = statistics.playerId;//this.currentMatch.statistics.forEach(p=> {});
    statistics.playerName = statistics.playerName;//this.currentMatch.statistics[this.currentStatisticIndex].playerName;
    statistics.goals = this.statisticForm.get('goals').value;
    statistics.assists = this.statisticForm.get('assists').value;
    return true;
  }

  async onChange($event) {
    let currentPlayer = $event.target.value;
    if (currentPlayer == null) {
      return;
    }
    let isPlayerInConvocation = false;
    // If the player is already in the convocation, will be not added
    this.currentMatch.statistics.forEach(async s => {
      if (s.playerId == currentPlayer.id) {
        isPlayerInConvocation = true;
      }
    });

    if (isPlayerInConvocation) {
      const toast = await this.toastController.create({
        message: this.translateService.instant('match.convocationPlayerError'),
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      $event.target.value = null;
      return;
    }

    this.currentMatch.statistics.push({ playerId: currentPlayer.id, playerName: `${currentPlayer.firstname} ${currentPlayer.lastname}`, assists: 0, goals: 0 });
    this.matchService.updateMatch(this.currentMatch.id, this.currentMatch).then(async res => {
      const toast = await this.toastController.create({
        message: this.translateService.instant('match.convocationSuccess'),
        duration: 2000,
        color: 'success'
      });
      toast.present();
      $event.target.value = null;
    })
  }

}
