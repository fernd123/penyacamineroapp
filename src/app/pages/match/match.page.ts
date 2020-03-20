import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/models/match.model';
import { Observable } from 'rxjs';
import { MatchService } from 'src/app/services/match.service';
import { ModalController } from '@ionic/angular';
import { MatchSavePage } from './save/match-save.page';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { MatchStatisticsService } from 'src/app/services/match-statistics.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  private title: string = 'match.title';
  public segment: string = 'next';
  public matchList: Observable<Match[]>;
  public matchHistoricList: Observable<Match[]>;
  private selectedCard = undefined;


  constructor(public modalController: ModalController,
    private matchService: MatchService,
    private matchStatisticService: MatchStatisticsService,
    public translateService: TranslateService) { }

  ngOnInit() {
    // Next match = active true
    this.matchList = this.matchService.getMatches().pipe(
      map(matches => matches.filter(match => match.active === false)));
    // Historical match = active false
    this.matchHistoricList = this.matchService.getMatches().pipe(
      map(matches => matches.filter(match => match.active === true)));
  }

  showIfUserIsAdmin() {
    let isUserAdmin = (localStorage.getItem('isUserAdmin') == "true");
    return isUserAdmin;
  }
  async presentModal(match: Match, card: any) {
    if (card != undefined) {
      this.selectedCard != undefined ? this.selectedCard.el.style.background = '' : '';
      this.selectedCard = card;
      card.el.style.background = '#00a0406b';
    }
    const modal = await this.modalController.create({
      component: MatchSavePage,
      componentProps: {
        'currentMatch': match
      }
    });
    return await modal.present();
  }

  deleteMatch(id: string) {
    this.matchService.deleteMatch(id);
  }

  getMatchTitle(match: Match) {
    if (match != undefined && match.localGoals == undefined) {
      return this.translateService.instant('match.noResult');
    } else {
      return `${this.translateService.instant('match.result')}: ${match.localGoals} - ${match.awayGoals}`;
    }
  }

  getMatchGoalsStatistics(match: Match) {
    let resumeG = this.translateService.instant('goals') + ": ";
    if (match.statistics != undefined && match.statistics.length > 0) {
      // Order by goals
      match.statistics.sort(function (a, b) {
        return b.goals.toString().localeCompare(a.goals.toString());
      });
      match.statistics.forEach(s => {
        if (s.goals != 0) {
          resumeG += s.playerName + "(" + s.goals + "), ";
        }
      });
      return resumeG.substr(0, resumeG.length - 2);
    }
    return "";
  }

  getMatchAssistStatistic(match: Match) {
    let resumeA = this.translateService.instant('assists') + ": ";
    if (match.statistics != undefined && match.statistics.length > 0) {
      // Order by assists
      match.statistics.sort(function (a, b) {
        return b.assists.toString().localeCompare(a.assists.toString());
      });
      match.statistics.forEach(s => {
        if (s.assists != 0) {
          resumeA += s.playerName + "(" + s.assists + "), ";
        }
      });
      return resumeA.substr(0, resumeA.length - 2);
    }
    return "";
  }

}
