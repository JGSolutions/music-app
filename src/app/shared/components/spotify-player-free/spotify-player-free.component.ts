import { Component, ChangeDetectionStrategy, OnDestroy, EventEmitter, Output, AfterContentInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { isEmpty as _isEmpty, isUndefined as _isUndefined } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/songs/songs.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';
import { LoadingPlayerAction } from 'src/app/core/stores/songs/songs.actions';
import { SongsState } from 'src/app/core/stores/songs/songs.state';

@Component({
  selector: 'app-spotify-player-free',
  templateUrl: './spotify-player-free.component.html',
  styleUrls: ['./spotify-player-free.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotifyPlayerFreeComponent implements OnDestroy, AfterContentInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ConnectedServicesState.connectedServices) connectedServices$!: Observable<Record<string, ConnectedServicesList>>;
  @Select(SongsState.loading) loading$!: Observable<boolean>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  @Output() trackReady = new EventEmitter<any>();
  @Output() close = new EventEmitter<string>();

  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public initPlaying$ = new BehaviorSubject<boolean>(true);
  public currentTimer$ = new BehaviorSubject<number>(0);
  public devicePlayback$ = new BehaviorSubject<string>("");
  public playSongLoading = false;

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store) {
  }

  ngAfterContentInit() {
    combineLatest([this.currentTrack$, this.devicePlayback$]).pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(([currentTrackPrevState], [currentTrackNextState]) => currentTrackPrevState.id === currentTrackNextState.id),
      tap(([currentTrack]) => this.trackReady.emit(currentTrack)),
    ).subscribe(async () => {
      this.store.dispatch(new LoadingPlayerAction(false));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public closeHandler(id: string): void {
    this.close.emit(id);
  }
}
