///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { isEmpty as _isEmpty } from "lodash";
import { Select, Store } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';
import { LoadingPlayerAction } from 'src/app/core/stores/player/player.actions';

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

  public initPlaying = true;
  public progress$!: Observable<number>;
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public playbackState$ = new BehaviorSubject<any>(null);
  public currentTimer$ = new BehaviorSubject<number>(0);

  private destroy$ = new Subject<boolean>();
  private playerUrl: string;
  private token!: string;
  private player!: Spotify.Player;

  constructor(private http: HttpClient, private store: Store) {
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
  }

  ngOnInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: 'Music App Playback SDK',
        getOAuthToken: (cb: any) => { cb(this.token); },
        volume: 0.4
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', state => {
        this.playbackState$.next(state);
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        this.currentTrack$.pipe(
          tap(() => this.store.dispatch(new LoadingPlayerAction(false))),
          distinctUntilChanged((prev, curr) => prev.id === curr.id),
          tap((currentTrack) => this.trackReady.emit(currentTrack)),
          switchMap(() => this.transferUserPlayback(device_id)),
          withLatestFrom(this.isPlaying$),
          takeUntil(this.destroy$)
        ).subscribe(([d, isPlaying]) => {
          if (!this.initPlaying) {
            this.player.pause();
            this.initPlaying = true;
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

    this.progress$ = combineLatest([this.isPlaying$, this.playbackState$]).pipe(
      filter(([isPlaying, playbackState]) => !_isEmpty(playbackState)),
      distinctUntilChanged((prev, curr) => prev[1].position === curr[1].position),
      switchMap(([isPlaying, playbackState]) => {
        if (this.initPlaying || !isPlaying) {
          return of(playbackState.position);
        }

        return timer(0, 1000).pipe(
          map((x) => x * 1000),
          map((x) => {
            this.currentTimer$.next(x + playbackState.position);
            return x + playbackState.position;
          }),
        );
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.player.disconnect();
  }

  public play() {
    if (this.initPlaying) {
      this.initialPlay().pipe(take(1)).subscribe(() => {
        this.initPlaying = false;
        this.isPlaying$.next(true);
      });
    } else {
      this.isPlaying$.next(true);
      this.player.resume();
    }
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

  async pause() {
    this.isPlaying$.next(false);
    await this.player.pause();
  }

  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChange(evt: number) {
    this.player.seek(evt);
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInput(evt: number): void {
    this.currentTimer$.next(evt);
  }

}
