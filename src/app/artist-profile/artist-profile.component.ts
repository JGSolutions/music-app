import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ArtistsState } from '../core/stores/artists/artists.state';
import { isUndefined as _isUndefined } from 'lodash';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from '../core/stores/connected-services/connected-services.types';
import { IArtists, IPlatformTypes } from 'models/artist.types';
import { ISongTrackType } from 'models/song.types';
import { LoadingPlayerAction } from '../core/stores/player/player.actions';
import { ICurrentTrack, ISongCommonState } from '../core/stores/songs/songs.types';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaylistDialogComponent } from '../shared/components/add-playlist-dialog/add-playlist-dialog.component';
import { SongsState } from '../core/stores/songs/songs.state';
import { ArtistSongsAction, ClearSongs, SetCurrentSelectedSongAction } from '../core/stores/songs/songs.actions';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit, OnDestroy {
  @Select(ArtistsState.artists) artists$!: Observable<Record<string, IArtists[]>>;
  @Select(ArtistsState.loading) loading$!: Observable<boolean>;
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ConnectedServicesState.servicesList) connectedServices$!: Observable<ConnectedServicesList[]>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  public artistDetails$ = this.store.select(ArtistsState.artistDetails);
  public songDetailById$ = this.store.select(SongsState.songDetailById);
  public songsByPlatform$ = this.store.select(SongsState.songsByPlatform);
  public artist!: string;
  public profileDetails$!: Observable<IArtists>;
  public artistGenres$!: Observable<string[]>;
  public songs$!: Observable<ISongCommonState[]>;

  private destroy$ = new Subject<boolean>();
  private _connectServiceType$ = new BehaviorSubject<IPlatformTypes>(IPlatformTypes.all);

  constructor(private route: ActivatedRoute, private store: Store, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.store.dispatch(new ClearSongs());
    this.artist = this.route.snapshot.params.artist;

    const artistDetails$ = this.artistDetails$.pipe(
      map((artist) => artist(this.artist)),
      filter(data => !_isUndefined(data)),
      shareReplay(1)
    );

    /**
     * Details for artist profile
     */
    this.profileDetails$ = artistDetails$.pipe(
      map((artists) => artists[0]),
      filter(data => !_isUndefined(data)),
      shareReplay(1)
    );

    /**
     * Gets list of songs for artist
     */
    artistDetails$.pipe(
      take(1),
      map((details) => {
        return details.map((detail) => {
          return {
            type: detail.platform,
            id: detail.id,
            username: detail.username
          }
        })
      }),
      withLatestFrom(this.user$),
      takeUntil(this.destroy$)
    ).subscribe(([data, user]) => {
      this.store.dispatch(new ArtistSongsAction(user.uid, data))
    });

    this.artistGenres$ = artistDetails$.pipe(
      map((details) => {
        return details.reduce((acc, value) => {
          if (value.genres) {
            acc = value.genres.map(genre => genre);
          }

          return acc;
        }, [] as string[]);
      })
    )
    this.songs$ = combineLatest([this._connectServiceType$, this.songsByPlatform$]).pipe(
      map(([platform, songsByPlatform]) => songsByPlatform(platform))
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedPlatform(evt: any) {
    this._connectServiceType$.next(evt);
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
        this.store.dispatch([
          new LoadingPlayerAction(true),
          new SetCurrentSelectedSongAction(data.id!, "songs")
        ]);
      }
    });
  }

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
          externalUrl: data?.externalUrl,
          createdTime: data?.createdTime
        };

        this.dialog.open(AddPlaylistDialogComponent, {
          maxWidth: '300px',
          panelClass: 'playlist-dialog',
          hasBackdrop: true,
          data: song
        });
      }
    });
  }
}
