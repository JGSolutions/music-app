import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import { IPlatformTypes } from 'models/artist.types';

@Injectable()
export class PlaylistService {
  constructor(private afs: AngularFirestore) { }

  public create(data: any): Promise<void> {
    return this.afs.collection('playlist').doc().set(data);
  }

  public addToPlaylist(data: any): Promise<void> {
    return this.afs.collection('playlist').doc().set(data);
  }
}
