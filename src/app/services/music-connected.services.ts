import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class MusicConnectedService {
  constructor(private afs: AngularFirestore) {}

  public connectService(data: any, type: string) {
    this.afs.collection('connectedServices').add({
      [type]: data
    });
  }
}
