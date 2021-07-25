import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { ArtistAlbumSongs, ArtistClearSongs, SetCurrentSelectedSongAction } from '../core/stores/artists/artists.actions';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { IPlatformTypes } from 'models/artist.types';
import { IAlbumInfo, ISong } from 'models/song.types';
import { LoadingPlayerAction } from '../core/stores/player/player.actions';
import { ICurrentTrack } from '../core/stores/artists/artists-state.types';
import { ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaylistDialogComponent } from '../shared/components/add-playlist-dialog/add-playlist-dialog.component';

@Component({
  selector: 'app-artist-album',
  templateUrl: './artist-album.component.html',
  styleUrls: ['./artist-album.component.scss']
})
export class ArtistAlbumComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artistAlbum) artistAlbum$!: Observable<IAlbumInfo>;
  @Select(ArtistsState.artistSongs) tracks$!: Observable<ISong[]>;
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ArtistsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  public songDetailById$ = this.store.select(ArtistsState.songDetailById);

  public songs$!: Observable<ISong[]>;
  public id!: string;
  public platform!: string;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new ArtistClearSongs());
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

  public selectedSong(selectedSong: string): void {
    this.currentTrack$.pipe(
      take(1),
      filter((currentTrack) => currentTrack.id !== selectedSong)
    ).subscribe(() => {
      this.store.dispatch([new LoadingPlayerAction(true), new SetCurrentSelectedSongAction(selectedSong)]);
    })
  }

  public addToPlayList(selectedSong: string): void {
    this.songDetailById$.pipe(
      take(1),
      map(fn => fn(selectedSong))
    ).subscribe((data: (ISong | undefined)) => {

      const song: ISelectedPlaylist = {
        id: data?.id,
        albumid: data?.albumid,
        albumName: data?.albumName,
        name: data?.name!,
        platform: data?.platform!,
        playlists: [],
        duration: data?.duration,
        durationType: data?.durationType!,
        trackType: data?.trackType!,
        picture: data?.pictures!
      };

      this.dialog.open(AddPlaylistDialogComponent, {
        maxWidth: '300px',
        panelClass: 'playlist-dialog',
        hasBackdrop: true,
        data: song
      });
    });
  }
}
