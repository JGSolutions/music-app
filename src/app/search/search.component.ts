import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { PlaylistDetailAction } from '../core/stores/playlist/playlist.actions';
import { ActivatedRoute } from '@angular/router';
import { PlaylistState } from '../core/stores/playlist/playlist.state';
import { IPlaylist, ISelectedPlaylist } from '../core/stores/playlist/playlist.types';
import { ICurrentTrack, ISongCommonState } from '../core/stores/songs/songs.types';
import { SongsState } from '../core/stores/songs/songs.state';
import { AllPlaylistTracksAction } from '../core/stores/songs/songs.actions';
import { ConnectedServicesList } from '../core/stores/connected-services/connected-services.types';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { IPlatformTypes } from 'models/artist.types';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(PlaylistState.playlistDetail) playlistDetail$!: Observable<IPlaylist>;
  @Select(SongsState.allPlaylistTracks) allPlaylistTracks$!: Observable<ISelectedPlaylist[]>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;
  @Select(ConnectedServicesState.servicesList) connectedServices$!: Observable<ConnectedServicesList[]>;

  public playlistSongsByPlatform$ = this.store.select(SongsState.playlistSongsByPlatform);
  public playlistid!: string;
  public songs$!: Observable<ISongCommonState[]>;

  private destroy$ = new Subject<boolean>();
  private _connectServiceType$ = new BehaviorSubject<IPlatformTypes>(IPlatformTypes.all);
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private store: Store, private route: ActivatedRoute, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.playlistid = this.route.snapshot.params.playlistid;

    this.user$.pipe(
      filter((user) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      this.store.dispatch(new AllPlaylistTracksAction(this.playlistid!, user.uid!));
      this.store.dispatch(new PlaylistDetailAction(this.playlistid!));
    });

    this.songs$ = combineLatest([this._connectServiceType$, this.playlistSongsByPlatform$]).pipe(
      map(([platform, songsByPlatform]) => songsByPlatform(platform)),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
