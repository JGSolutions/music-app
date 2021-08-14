import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { IPlatformTypes } from 'models/artist.types';
import { IAlbumInfo, ISong } from 'models/song.types';
import { ICurrentTrack, ISongCommonState } from '../core/stores/songs/songs.types';
import { ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaylistDialogComponent } from '../shared/components/add-playlist-dialog/add-playlist-dialog.component';
import { SongsState } from '../core/stores/songs/songs.state';
import { ArtistAlbumSongs, ClearSongs, SetCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';

@Component({
  selector: 'app-artist-album',
  templateUrl: './artist-album.component.html',
  styleUrls: ['./artist-album.component.scss']
})
export class ArtistAlbumComponent implements OnInit, OnDestroy {
  @Select(SongsState.artistAlbum) artistAlbum$!: Observable<IAlbumInfo>;
  @Select(SongsState.songs) tracks$!: Observable<ISong[]>;
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  public songDetailById$ = this.store.select(SongsState.songDetailById);

  public songs$!: Observable<ISong[]>;
  public id!: string;
  public platform!: string;

  private destroy$ = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private store: Store, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new ClearSongs());
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
      filter((currentTrack) => currentTrack?.id !== selectedSong)
    ).subscribe(() => {
      this.store.dispatch([new SetCurrentSelectedSongAction(selectedSong, "songs")]);
    });
  }

  public addToPlayList(selectedSong: string): void {
    this.songDetailById$.pipe(
      take(1),
      map(songDetails => songDetails(selectedSong))
    ).subscribe((data: (ISongCommonState | undefined)) => {
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
        pictures: data?.pictures!,
        createdTime: data?.createdTime!
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
