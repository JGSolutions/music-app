import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICurrentTrack } from '../core/stores/artists/artists-state.types';

@Injectable()
export class HistoryService {
  constructor(private afs: AngularFirestore) { }

  public addToHistory(uid: string, currentTrack: ICurrentTrack): Promise<DocumentReference<any>> {
    return this.afs.collection('history').doc(uid).collection('tracks').add(currentTrack);
  }

  public getHistory(uid: string): Observable<any> {
    const historyTracks = this.afs.doc<ICurrentTrack>(`history/${uid}`).collection('tracks').valueChanges();
    return historyTracks;
  }
}
