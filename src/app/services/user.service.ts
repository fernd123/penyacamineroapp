import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userList: Observable<User[]>;
    private userCollection: AngularFirestoreCollection<User>;

    constructor(private afs: AngularFirestore) {
        this.userCollection = this.afs.collection<User>('users');
        this.userList = this.userCollection.snapshotChanges().pipe(
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

    getUsers(): Observable<User[]> {
        return this.userList;
    }

    getUser(id: string): Observable<User> {
        return this.userCollection.doc<User>(id).valueChanges().pipe(
            take(1),
            map(idea => {
                idea.id = id;
                return idea
            })
        );
    }

    addUser(User: User): Promise<DocumentReference> {
        return this.userCollection.add(User);
    }

    updateUser(id: string, User: User): Promise<void> {
        return this.userCollection.doc(id).update(User);
    }

    deleteUser(id: string): Promise<void> {
        return this.userCollection.doc(id).delete();
    }

    getUserByFirebaseId(id: string) {
        return this.userCollection.ref.where("firebaseUserId", "==", id).get();
    }
}