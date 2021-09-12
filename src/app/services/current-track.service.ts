import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ICurrentTrack } from '../core/stores/songs/songs.types';

@Injectable()
export class CurrentTrackService {
  constructor(private afs: AngularFirestore) { }

  public saveCurrentTrack(uid: string, currentTrack: ICurrentTrack): Promise<void> {
    return this.afs.collection('currentTrack').doc(uid).set(currentTrack, { merge: true });
  }

  public getCurrentTrack(uid: string): Observable<ICurrentTrack | undefined> {
    return this.afs.doc<ICurrentTrack>(`currentTrack/${uid}`).valueChanges();
  }

  public deleteTrack(uid: string) {
    return this.afs.doc<ICurrentTrack>(`currentTrack/${uid}`).delete();
  }
}
