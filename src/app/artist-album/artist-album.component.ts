import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ArtistAlbumSongs, SetCurrentSelectedSongAction } from '../core/stores/artists/artists.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { IPlatformTypes } from 'models/artist.types';
import { IAlbumInfo, ISong } from 'models/song.types';
import { LoadingPlayerAction } from '../core/stores/player/player.actions';
import { ISelectedSong } from '../typings/selected-song.types';

@Component({
  selector: 'app-artist-album',
  templateUrl: './artist-album.component.html',
  styleUrls: ['./artist-album.component.scss']
})
export class ArtistAlbumComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artistAlbum) artistAlbum$!: Observable<IAlbumInfo>;
  @Select(ArtistsState.artistSongs) tracks$!: Observable<ISong[]>;
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public songDetailById$ = this.store.select(ArtistsState.songDetailById);

  public songs$!: Observable<ISong[]>;
  public id!: string;
  public platform!: string;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.platform = this.route.snapshot.params.platform;
    this.id = this.route.snapshot.params.id;

    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null)
    ).subscribe((user) => {
      this.store.dispatch(new ArtistAlbumSongs(user.uid, this.platform as IPlatformTypes, this.id));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedSong(selectedSong: ISelectedSong): void {
    this.store.dispatch([new LoadingPlayerAction(true), new SetCurrentSelectedSongAction(selectedSong.id)]);
  }
}
