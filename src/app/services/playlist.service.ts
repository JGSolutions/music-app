import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IPlaylist, ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { clone as _clone } from "lodash";
@Injectable()
export class PlaylistService {
  constructor(private afs: AngularFirestore) { }

  public create(data: any): Promise<void> {
    return this.afs.collection('playlist').doc().set(data);
  }

  public update(data: any, id: string): Promise<void> {
    return this.afs.collection('playlist').doc(id).set(data, { merge: true });
  }

  public updateSelectedPlaylistTracks(data: ISelectedPlaylist, uid: string): Promise<void> {
    return this.afs.collection('playlistTracks').doc(uid).collection('list').doc(data.id).set(data, { merge: true });
  }

  public deleteSelectedPlaylist(id: string, uid: string): Promise<void> {
    return this.afs.collection('playlistTracks').doc(uid).collection('list').doc(id).delete();
  }

  public getPlaylistTrack(uid: string, songid: string) {
    return this.afs.collection('playlistTracks').doc(uid).collection('list').doc(songid).valueChanges();
  }

  public getAllPlaylistTrack(playlistid: string, uid: string) {
    return this.afs.collection('playlistTracks').doc(uid).collection('list', (ref) =>
      ref.where("playlists", "array-contains", playlistid)
    ).valueChanges();
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

  public removeCoverImage(trackid: string, playlistid: string, uid: string) {
    this.getPlaylists(uid).pipe(
      take(1)
    ).subscribe(data => {
      const playlist = data.find(e => e.id === playlistid);

      const filteredImages = playlist!.coverImages?.filter(e => e.id !== trackid);

      this.update({
        coverImages: filteredImages
      }, playlistid);

    })
  }
}
