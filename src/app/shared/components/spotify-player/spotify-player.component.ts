///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isEmpty as _isEmpty } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { distinctUntilChanged, filter, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';
import { LoadingPlayerAction } from 'src/app/core/stores/player/player.actions';
import { SetCurrentTrackPlayStatusAction } from 'src/app/core/stores/artists/artists.actions';

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotifyPlayerComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(ConnectedServicesState.connectedServices) connectedServices$!: Observable<Record<string, ConnectedServicesList>>;

  @Input() loading$!: Observable<boolean>;
  @Input() currentTrack$!: Observable<ICurrentTrack>;

  @Output() trackReady = new EventEmitter<any>();
  @Output() trackEnded = new EventEmitter<void>();

  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public initPlaying$ = new BehaviorSubject<boolean>(true);
  public playbackState$ = new BehaviorSubject<any>(null);
  public currentTimer$ = new BehaviorSubject<number>(0);

  private destroy$ = new Subject<boolean>();
  private playerUrl: string;
  private token!: string;
  private player!: Spotify.Player;
  private _setIntervalTimer!: any;
  private _seekPosition = 0;

  constructor(private http: HttpClient, private store: Store) {
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
  }

  ngOnInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: 'Music App Playback SDK',
        getOAuthToken: (cb: any) => { cb(this.token); },
        volume: 0.3
      });

      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      this.player.addListener('player_state_changed', state => {
        if (this.isEndOfTrack(state)) {
          this.currentTimer$.next(0);
          this.initPlaying$.next(true);
          this.pause();

          this.trackEnded.emit();
        }

        this.playbackState$.next(state);
      });

      this.player.addListener('ready', ({ device_id }) => {
        this.currentTrack$.pipe(
          tap(() => this.store.dispatch(new LoadingPlayerAction(false))),
          distinctUntilChanged((prev, curr) => prev.id === curr.id),
          tap((currentTrack) => this.trackReady.emit(currentTrack)),
          switchMap(() => this.transferUserPlayback(device_id)),
          withLatestFrom(this.initPlaying$),
          takeUntil(this.destroy$)
        ).subscribe(async ([d, initPlaying]) => {
          if (!initPlaying) {
            this._seekPosition = 0;
            this.currentTimer$.next(this._seekPosition);
            this.initPlaying$.next(true);
            await this.pause();
            this.play();
          } else {
            this.initPlaying$.next(false);
            this.play();
          }
        });
      });

      this.player.connect();
    };

    this.connectedServices$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(token => {
      this.token = token["spotify"].token;
      window.onSpotifyWebPlaybackSDKReady();
    });

    this.isPlaying$.pipe(
      filter((isPlaying) => isPlaying),
    ).subscribe(() => {
      this._setIntervalTimer = setInterval(() => {
        this._seekPosition++;
        this.currentTimer$.next(this._seekPosition * 1000);
      }, 1000);
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.player.disconnect();
  }

  public play() {
    this.store.dispatch(new SetCurrentTrackPlayStatusAction(true));
    this.initPlaying$.pipe(
      take(1)
    ).subscribe(initPlaying => {
      if (initPlaying) {
        this.initialPlay().pipe(take(1)).subscribe(() => {
          this.initPlaying$.next(false);
          this.isPlaying$.next(true);
        });
      } else {
        this.isPlaying$.next(true);
        this.player.resume();
      }
    })
  }

  private initialPlay() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${this.token}`
      })
    };

    return this.currentTrack$.pipe(
      take(1),
      switchMap((currentTrack) => {
        const request = {
          uris: [`spotify:track:${currentTrack.id}`]
        }
        return this.http.put(`${this.playerUrl}/play`, request, httpOptions);
      })
    );
  }

  private isEndOfTrack(state: any): boolean {
    return state
      && state.track_window.previous_tracks.find((x: any) => x.id === state.track_window.current_track.id)
      && state.paused;
  }

  public transferUserPlayback(deviceId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${this.token}`
      })
    };

    return this.http.put(this.playerUrl, {
      device_ids: [deviceId],
      play: false
    }, httpOptions);
  }

  async pause(): Promise<void> {
    this.isPlaying$.next(false);
    clearInterval(this._setIntervalTimer);
    this.store.dispatch(new SetCurrentTrackPlayStatusAction(false));
    return await this.player.pause();
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

}
