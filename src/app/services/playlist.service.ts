import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPlaylist, ISelectedPlaylist } from '../core/stores/playlist/playlist.types';

@Injectable()
export class PlaylistService {
  constructor(private afs: AngularFirestore) { }

  public create(data: any): Promise<void> {
    return this.afs.collection('playlist').doc().set(data);
  }

  public updateSelectedPlaylist(data: ISelectedPlaylist, uid: string): Promise<void> {
    return this.afs.collection('playlistTracks').doc(uid).collection('list').doc(data.id).set(data, { merge: true });
  }

  public getPlaylistTrack(uid: string, songid: string) {
    return this.afs.collection('playlistTracks').doc(uid).collection('list').doc(songid).valueChanges();
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
