///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { isEmpty as _isEmpty } from "lodash";
import { Select } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';

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

  constructor(private http: HttpClient) {
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
          distinctUntilChanged((prev, curr) => prev.id === curr.id),
          takeUntil(this.destroy$)
        ).subscribe(currentTrack => {
          this.trackReady.emit(currentTrack);
        });

        this.transferUserPlayback(device_id).subscribe();
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
      switchMap(([isPlaying, playbackState]) => {
        if (this.initPlaying) {
          return of(0);
        }

        if (!isPlaying) {
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
      this.initialPlay().subscribe(() => {
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
          uris: [`spotify:track:${currentTrack.id}`],
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
    this.play();
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInput(evt: number): void {
    this.currentTimer$.next(evt);
  }

}
