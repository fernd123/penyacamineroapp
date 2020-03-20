import { Time } from '@angular/common';
import { Lineup } from './lineup.model';
import { Parent } from './parent.model';
import { Player } from './player.model';

export class Match extends Parent {
    initHour: Time;
    endHour: Time;
    date: Date;
    place: string;
    type: string;
    localGoals: Number;
    awayGoals: Number;
    lineUpLocal: Lineup;
    lineUpAway: Lineup;
    convocation: any[]; //Player ids
    statistics: any[];
}