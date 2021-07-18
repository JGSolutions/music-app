import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlaylist } from '../core/stores/playlist/playlist.types';

@Injectable()
export class PlaylistService {
  constructor(private afs: AngularFirestore) { }

  public create(data: any): Promise<void> {
    return this.afs.collection('playlist').doc().set(data);
  }

  public addToPlaylist(data: any, id: string): Promise<void> {
    return this.afs.collection('playlist').doc(id).collection("list").doc().set(data);
  }

  public getPlaylists(uid: string): Observable<IPlaylist[]> {
    return this.afs
      .collection<IPlaylist>("playlist", (ref) =>
        ref.where("uid", "==", uid)
      ).snapshotChanges()
      .pipe(
        map((exercises) => {
          const data = exercises.map((a) => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() };
          });

          return data;
        })
      );
  }
}
