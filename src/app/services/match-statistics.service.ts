import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({
    providedIn: 'root'
})
export class MatchStatisticsService {
    private matchList: Observable<Match[]>;
    private matchCollection: AngularFirestoreCollection<Match>;

    constructor(private afs: AngularFirestore) {
        this.matchCollection = this.afs.collection<Match>('matchstatistics');
        this.matchList = this.matchCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    data.id = id;
                    return { ...data };
                });
            })
        );
    }

    getStatisticsByMatch(matchId: string) {
        return this.matchCollection.ref.where("matchId", "==", matchId).get();
    }

    addMatchStatistic(statistics: any): Promise<DocumentReference> {
        return this.matchCollection.add(statistics);
    }

    updateMatchStatistic(id: string, statistic: any): Promise<void> {
        return this.matchCollection.doc(id).update(statistic);
    }

    deleteMatchStatistic(id: string): Promise<void> {
        return this.matchCollection.doc(id).delete();
    }
}