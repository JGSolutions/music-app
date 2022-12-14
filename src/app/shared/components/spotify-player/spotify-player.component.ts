///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, ChangeDetectionStrategy, OnDestroy, EventEmitter, Output, AfterContentInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { isEmpty as _isEmpty, isUndefined as _isUndefined } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/songs/songs.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { distinctUntilChanged, filter, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';
import { IPlatformTypes } from 'models/artist.types';
import { LoadingPlayerAction, SetCurrentTrackPlayStatusAction } from 'src/app/core/stores/songs/songs.actions';
import { SongsState } from 'src/app/core/stores/songs/songs.state';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotifyPlayerComponent implements OnDestroy, AfterContentInit {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ConnectedServicesState.connectedServices) connectedServices$!: Observable<Record<string, ConnectedServicesList>>;
  @Select(SongsState.loading) loading$!: Observable<boolean>;
  @Select(SongsState.currentTrack) currentTrack$!: Observable<ICurrentTrack>;

  @Output() trackReady = new EventEmitter<any>();
  @Output() trackEnded = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<string>();
  @Output() addPlaylist = new EventEmitter<ICurrentTrack>();

  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public initPlaying$ = new BehaviorSubject<boolean>(true);
  public currentTimer$ = new BehaviorSubject<number>(0);
  public devicePlayback$ = new BehaviorSubject<string>("");
  public playSongLoading = false;

  private destroy$ = new Subject<void>();
  private token!: string;
  private player!: Spotify.Player;
  private _setIntervalTimer!: any;
  private _seekPosition!: number;

  constructor(private store: Store, private apiService: ApiService) {
  }

  ngAfterContentInit() {
    combineLatest([this.currentTrack$, this.devicePlayback$]).pipe(
      filter(([currentTrack, devicePlayback]) => currentTrack?.platform === IPlatformTypes.spotify && devicePlayback !== ""),
      distinctUntilChanged(([currentTrackPrevState], [currentTrackNextState]) => currentTrackPrevState.id === currentTrackNextState.id),
      tap(([currentTrack]) => this.trackReady.emit(currentTrack)),
      switchMap(([currentTrack, devicePlayback]) => this.transferUserPlayback(devicePlayback)),
      takeUntil(this.destroy$),
    ).subscribe(async () => {
      this.store.dispatch(new LoadingPlayerAction(false));
      this.resetDuration();
      await this.pause();
    });

    window.onSpotifyWebPlaybackSDKReady = async () => {
      this.player = new Spotify.Player({
        name: 'Music App',
        getOAuthToken: (cb: any) => { cb(this.token); },
        volume: 1
      });

      this.player.addListener('initialization_error', ({ message }) => { console.error("init error: ", message); });
      this.player.addListener('authentication_error', ({ message }) => {
        console.log("ERROR HAS OCCURED: ", message);
        console.error(message);
      });
      this.player.addListener('account_error', ({ message }) => { console.error("account error: ", message); });
      this.player.addListener('playback_error', ({ message }) => { console.error("playback error: ", message); });

      this.player.addListener('player_state_changed', state => {
        if (this.isEndOfTrack(state)) {
          this.resetDuration();
          this.pause();
          this.trackEnded.emit();
        }
      });

      this.player.addListener('ready', ({ device_id }) => {
        this.devicePlayback$.next(device_id);
      });

      this.player.connect();
    };

    this.connectedServices$.pipe(
      takeUntil(this.destroy$),
      filter((token) => !_isEmpty(token["spotify"]))
    ).subscribe(token => {
      this.token = token["spotify"].token;

      if (_isUndefined(this.player)) {
        window.onSpotifyWebPlaybackSDKReady();
      }
    });

    this.isPlaying$.pipe(
      takeUntil(this.destroy$),
      filter((isPlaying) => isPlaying)
    ).subscribe(() => {
      this._setIntervalTimer = setInterval(() => {
        this._seekPosition++;
        this.currentTimer$.next(this._seekPosition * 1000);
      }, 1000);
    })
  }

  ngOnDestroy() {
    this.player.disconnect();
    this.destroy$.next();
  }

  public closeHandler(): void {
    this.currentTrack$.pipe(
      take(1)
    ).subscribe((currentTrack) => {
      this.closeEvent.emit(currentTrack.id);
    });
  }

  public addPlaylistHander(): void {
    this.currentTrack$.pipe(
      take(1)
    ).subscribe((currentTrack: ICurrentTrack) => {
      this.addPlaylist.emit(currentTrack);
    });
  }

  public play(): void {
    this.initPlaying$.pipe(
      takeUntil(this.destroy$),
      tap(() => this.playSongLoading = true),
      take(1)
    ).subscribe(async (initPlaying) => {
      if (initPlaying) {
        this.initialPlay().pipe(take(1)).subscribe(() => {
          this.initPlaying$.next(false);
          this.isPlaying$.next(true);
          this.playSongLoading = false;
          /**
           * We want to position to specific area
           */
          // this.currentTimer$.next(10000);
          // this._seekPosition = evt / 1000;
          // this.player.seek(60 * 7000);
        });
      } else {
        this.isPlaying$.next(true);
        await this.player.resume();

        this.playSongLoading = false;
      }
    })
  }

  private initialPlay() {
    return this.currentTrack$.pipe(
      take(1),
      withLatestFrom(this.user$),
      switchMap(([currentTrack, user]) => this.apiService.spotifyPlayback(currentTrack.id, user.uid!))
    );
  }

  private isEndOfTrack(state: any): boolean {
    return state
      && state.track_window.previous_tracks.find((x: any) => x.id === state.track_window.current_track.id)
      && state.paused;
  }

  public transferUserPlayback(deviceId: string) {
    return this.user$.pipe(
      take(1),
      switchMap((user) => this.apiService.spotifyDevicePlayback(deviceId, user.uid!))
    );
  }

  public pauseHandler(): void {
    this.isPlaying$.next(false);
    this.pause();
  }

  async pause() {
    clearInterval(this._setIntervalTimer);
    this.store.dispatch(new SetCurrentTrackPlayStatusAction(false));
    if (this.player) {
      return await this.player.pause();
    }
  }

  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChange(evt: number) {
    this._seekPosition = evt / 1000;
    this.player.seek(evt);
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInput(evt: number): void {
    this._seekPosition = evt / 1000;
    this.currentTimer$.next(evt);
  }

  private resetDuration(): void {
    this._seekPosition = 0;
    this.currentTimer$.next(0);
    this.initPlaying$.next(true);
    this.isPlaying$.next(false);
  }
}
