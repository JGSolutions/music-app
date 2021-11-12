import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { clone as _clone } from "lodash";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPlayListDetails, IPlayLists } from '../../../models/playlist.types';
import { IPlatformTypes } from 'models/artist.types';

@Injectable()
export class PlaylistService {
  private domainApi = environment.restapiDomain;

  constructor(private afs: AngularFirestore, private http: HttpClient) { }

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

  // public getAllPlaylistTrack(playlistid: string, uid: string) {
  //   return this.afs.collection('playlistTracks').doc(uid).collection('list', (ref) =>
  //     ref.where("playlists", "array-contains", playlistid)
  //   ).valueChanges();
  // }

  // public removePlaylistTrack(playlistid: string, trackid: string, uid: string) {
  //   return this.afs.collection('playlistTracks').doc(uid).collection("list").doc(trackid).delete();
  // }

  // public getPlaylists(uid: string): Observable<IPlaylist[]> {
  //   return this.afs
  //     .collection<IPlaylist>("playlist", (ref: any) =>
  //       ref.where("uid", "==", uid)
  //     ).snapshotChanges()
  //     .pipe(
  //       map((exercises: any[]) => {
  //         const data = exercises.map((a) => {
  //           return { id: a.payload.doc.id, ...a.payload.doc.data() };
  //         });

  //         return data;
  //       })
  //     );
  // }

  public playlists(uid: string): Observable<IPlayLists[]> {
    const url = `${this.domainApi}/playlists`;

    const headers = {
      headers: {
        "Authorization": uid
      },
    };

    return this.http.get<IPlayLists[]>(url, headers);
  }

  public playlistDetails(uid: string, playlistId: string, platform: IPlatformTypes): Observable<IPlayListDetails[]> {
    const url = `${this.domainApi}/playlistDetails?playlistid=${playlistId}&platform=${platform}`;

    const headers = {
      headers: {
        "Authorization": uid
      },
    };

    return this.http.get<IPlayListDetails[]>(url, headers);
  }
}
