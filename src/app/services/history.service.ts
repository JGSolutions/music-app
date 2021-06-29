import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICurrentTrack } from '../core/stores/artists/artists-state.types';
import { IHistoryTracks } from '../core/stores/history/history.types';

@Injectable()
export class HistoryService {
  constructor(private afs: AngularFirestore) { }

  public addToHistory(uid: string, track: IHistoryTracks): Promise<void> {
    return this.afs.collection('history').doc(uid).collection('tracks').doc(track.id).set(track);
  }

  public getHistory(uid: string): Observable<any> {
    const historyTracks = this.afs.doc<ICurrentTrack>(`history/${uid}`).collection('tracks').valueChanges();
    return historyTracks;
  }
}
