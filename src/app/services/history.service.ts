import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IHistoryTracks } from '../core/stores/history/history.types';

@Injectable()
export class HistoryService {
  constructor(private afs: AngularFirestore) { }

  public addToHistory(uid: string, track: IHistoryTracks): Promise<void> {
    return this.afs.collection('history').doc(uid).collection('tracks').doc(track.id).set(track);
  }

  public getHistory(uid: string): Observable<IHistoryTracks[]> {
    const historyTracks = this.afs.doc(`history/${uid}`).collection<IHistoryTracks>('tracks').valueChanges();
    return historyTracks;
  }
}
