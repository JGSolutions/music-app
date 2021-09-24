import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { ISongTrackType } from 'models/song.types';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';
import { SetCurrentSelectedSongAction } from 'src/app/core/stores/songs/songs.actions';
import { SongsState } from 'src/app/core/stores/songs/songs.state';
import { ICurrentTrack, ISongCommonState } from 'src/app/core/stores/songs/songs.types';
import { AddPlaylistDialogComponent } from '../add-playlist-dialog/add-playlist-dialog.component';
@Component({
  selector: 'app-artist-songs',
  templateUrl: './artist-songs.component.html',
  styleUrls: ['./artist-songs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistSongsComponent {
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(SongsState.songsLoading) songsLoading$!: Observable<boolean>;
  @Select(ConnectedServicesState.servicesList) connectedServicesList$!: Observable<ConnectedServicesList[]>;

  @Input() artistGenres$!: Observable<string[]>;
  @Input() profileDetails$!: Observable<IArtists>;
  @Input() songsByPlatform$!: Observable<ISongCommonState[]>;

  public songs$!: Observable<ISongCommonState[]>;
  public songDetailById$ = this.store.select(SongsState.songDetailById);

  constructor(private store: Store, private dialog: MatDialog, private router: Router) { }

  public addToPlayList(selectedSong: string): void {
    this.songDetailById$.pipe(
      take(1),
      map(fn => fn(selectedSong))
    ).subscribe((data: (ISongCommonState | undefined)) => {
      if (data?.trackType !== ISongTrackType.track) {
        this.router.navigate(['artist-album', data?.platform, data?.id]);
      } else {
        const song: ISongCommonState = {
          id: data?.id,
          name: data?.name!,
          platform: data?.platform!,
          playlists: [],
          duration: data?.duration,
          durationType: data?.durationType!,
          trackType: data?.trackType!,
          pictures: data?.pictures!,
          artist: data?.artist,
          externalUrl: data?.externalUrl,
          createdTime: data?.createdTime,
          streamUrl: data?.streamUrl || ""
        };

        this.dialog.open(AddPlaylistDialogComponent, {
          maxWidth: '350px',
          panelClass: 'playlist-dialog',
          hasBackdrop: true,
          data: song
        });
      }
    });
  }

  public selectedSong(selectedSong: string): void {
    combineLatest([this.songDetailById$, this.currentTrack$]).pipe(
      take(1),
      filter(([songDetailById, currentTrack]) => currentTrack?.id !== selectedSong),
      map(([songDetailById]) => songDetailById(selectedSong))
    ).subscribe((data: ISongCommonState | undefined) => {
      if (data?.trackType !== ISongTrackType.track) {
        this.router.navigate(['artist-album', data?.platform, data?.id]);
      } else {
        this.store.dispatch(new SetCurrentSelectedSongAction(data.id!, "songs"));
      }
    });
  }

  public selectedPlatform(evt: any) {
    // this.store.dispatch(new FilterArtistsByPlatformAction(evt));
  }
}
