import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { MatchService } from 'src/app/services/match.service';
import { Match } from 'src/app/models/match.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.page.html',
  styleUrls: ['./statistic.page.scss'],
})
export class StatisticPage implements OnInit {

  public title: string = "statistics";
  public type: string = "";
  public showTableResult: boolean = false;
  private matchList: Observable<Match[]>;


  private matchArray = [];
  private goalsArray = [];
  private assistsArray = [];
  public showList = [];

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    let loading = await this.loadingCtrl.create({
      message: this.translateService.instant('loading')
    });
    loading.present();
    this.matchService.getMatches().subscribe(res => {
      this.getStatistics(res);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    });
  }

  getStatistics(res) {
    // Positive = asc, Negative = desc
    let numberSort = function (a, b) {
      return a.value < b.value ? 1 : -1;
    };

    let maxMatchesList: any = {};
    let maxGoalsList: any = {};
    let maxAssistsList: any = {};
    this.matchArray = [];
    this.goalsArray = [];
    this.assistsArray = [];

    res.forEach((match: any) => {
      if (match.statistics != undefined) {
        match.statistics.forEach(s => {
          if (maxMatchesList[s.playerName] == null) {
            maxMatchesList[s.playerName] = 0;
            maxAssistsList[s.playerName] = 0;
            maxGoalsList[s.playerName] = 0;
          }

          maxMatchesList[s.playerName] = maxMatchesList[s.playerName] + 1;
          maxAssistsList[s.playerName] = maxAssistsList[s.playerName] + s.assists;
          maxGoalsList[s.playerName] = maxGoalsList[s.playerName] + s.goals;
        });
      };
    });

    // Matches
    for (var key in maxMatchesList) {
      var attrName = key;
      var attrValue = maxMatchesList[key];
      this.matchArray.push({ "player": attrName, "value": attrValue });
    }
    this.matchArray.sort(numberSort);


    // Goals
    for (var key in maxGoalsList) {
      var attrName = key;
      var attrValue = maxGoalsList[key];
      this.goalsArray.push({ "player": attrName, "value": attrValue });
    }
    this.goalsArray.sort(numberSort);

    // Assists
    for (var key in maxAssistsList) {
      var attrName = key;
      var attrValue = maxAssistsList[key];
      this.assistsArray.push({ "player": attrName, "value": attrValue });
    }
    this.assistsArray.sort(numberSort);
  }


  show(type: string) {
    this.showTableResult = true;
    this.type = type;
    switch (type) {
      case "matches":
        this.showList = this.matchArray;
        break;
      case "goals":
        this.showList = this.goalsArray;
        break;
      case "assists":
        this.showList = this.assistsArray;
        break;
    }
  }

  close() {
    if (!this.showTableResult) {
      return this.router.navigateByUrl('/home');
    } else {
      this.showTableResult = !this.showTableResult
    }
  }





}
