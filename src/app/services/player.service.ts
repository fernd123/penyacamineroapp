import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private playerList: Observable<Player[]>;
    private playerCollection: AngularFirestoreCollection<Player>;

    constructor(private afs: AngularFirestore) {
        this.playerCollection = this.afs.collection<Player>('players');
        this.playerList = this.playerCollection.snapshotChanges().pipe(
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

    getPlayers(): Observable<Player[]> {
        return this.playerList;
    }

    getPlayer(id: string): Observable<Player> {
        return this.playerCollection.doc<Player>(id).valueChanges().pipe(
            take(1),
            map(idea => {
                idea.id = id;
                return idea
            })
        );
    }

    addPlayer(player: Player): Promise<DocumentReference> {
        return this.playerCollection.add(player);
    }

    updatePlayer(id: string, player: Player): Promise<void> {
        return this.playerCollection.doc(id).update(player);
    }

    deletePlayer(id: string): Promise<void> {
        return this.playerCollection.doc(id).delete();
    }

    getPlayerByParameterId(parameterName: string, value: string) {
        return this.playerCollection.ref.where(parameterName, "==", value).get();
    }

    getPlayerById(id: string) {
        return this.playerCollection.doc(id).ref.get();
    }
}