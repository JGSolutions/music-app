import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlatformTypes } from 'models/artist.types';
import firebase from 'firebase/compat/app';

@Injectable()
export class MusicConnectedService {
  constructor(private afs: AngularFirestore) { }

  public connectService(uid: string, data: any, type: string): Promise<void> {
    return this.afs.collection('connectedServices').doc(uid).set({
      [type]: data
    }, { merge: true });
  }

  public connectedServices(uid: string): Observable<any> {
    return this.afs.collection('connectedServices').doc(uid).snapshotChanges().pipe(
      map((sets: any) => sets.payload.data()),
    );
  }

  public disconnectService(uid: string | undefined, type: IPlatformTypes): Promise<void> {
    return this.afs.collection('connectedServices').doc(uid).update({
      [type]: firebase.firestore.FieldValue.delete()
    });
  }
}
