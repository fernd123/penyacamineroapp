import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { MatchStatisticsService } from './match-statistics.service';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private matchList: Observable<Match[]>;
    private matchHistoricList: Observable<Match[]>;
    private matchCollection: AngularFirestoreCollection<Match>;

    constructor(private afs: AngularFirestore,
        private matchStatisticService: MatchStatisticsService) {
        this.matchCollection = this.afs.collection<Match>('matches');
        this.matchList = this.matchCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data: any = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    data.id = id;
                    return { ...data };
                });
            })
        );
    }

    getMatches(): Observable<Match[]> {
        return this.matchList;
    }

    getHistoricMatches(): Observable<Match[]> {
        return this.matchHistoricList;
    }

    getMatch(id: string): Observable<Match> {
        return this.matchCollection.doc<Match>(id).valueChanges().pipe(
            take(1),
            map(match => {
                match.id = id;
                return match;
            })
        );
    }

    addMatch(match: Match): Promise<DocumentReference> {
        return this.matchCollection.add(match);
    }

    updateMatch(id: string, match: Match): Promise<void> {
        return this.matchCollection.doc(id).update(match);
    }

    deleteMatch(id: string): Promise<void> {
        return this.matchCollection.doc(id).delete();
    }
}