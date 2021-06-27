import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICurrentTrack } from '../core/stores/artists/artists-state.types';

@Injectable()
export class CurrentTrackService {
  constructor(private afs: AngularFirestore) { }

  public saveCurrentTrack(uid: string, currentTrack: ICurrentTrack): Promise<void> {
    return this.afs.collection('currentTrack').doc(uid).set(currentTrack, { merge: true });
  }

}
