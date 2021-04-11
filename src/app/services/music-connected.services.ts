import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class MusicConnectedService {
  constructor(private afs: AngularFirestore) {}

  public connectService(uid: string, data: any, type: string) {
    this.afs.collection('connectedServices').doc(uid).set({
      [type]: data
    }, { merge: true });
  }
}
