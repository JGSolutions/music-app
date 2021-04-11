import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import 'firebase/firestore';
import { IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';

@Injectable()
export class MusicConnectedService {
  constructor(private afs: AngularFirestore) {}

  public connectService(uid: string, data: any, type: string) {
    this.afs.collection('connectedServices').doc(uid).set({
      [type]: data
    }, { merge: true });
  }

  public connectedServices(uid: string): Observable<any> {
    return this.afs.collection('connectedServices').doc(uid).snapshotChanges().pipe(
      map((sets: any) => sets.payload.data()),
    );
  }

  public disonnectService(uid: string | undefined, type: IConnectedServicesTypes) {
    this.afs.collection('connectedServices').doc(uid).update({
      [type]: firebase.firestore.FieldValue.delete()
    });
  }
}
