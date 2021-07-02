///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { isEmpty as _isEmpty } from "lodash";
import { Select } from '@ngxs/store';
import { ICurrentTrack } from 'src/app/core/stores/artists/artists-state.types';
import { UserState } from 'src/app/core/stores/user/user.state';
import { IUserType } from 'src/app/core/stores/user/user.types';
import { ArtistsState } from 'src/app/core/stores/artists/artists.state';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';
import { ConnectedServicesState } from 'src/app/core/stores/connected-services/connected-services.state';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';

// declare global {
//   interface Window { onSpotifyWebPlaybackSDKReady: any; }
// }

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

  private destroy$ = new Subject<boolean>();
  private playerUrl: string;
  private token!: string;

  constructor(private http: HttpClient) {
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
  }

  ngOnInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Music App Playback SDK',
        getOAuthToken: (cb: any) => { cb(this.token); },
        volume: 0.5
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        this.transferUserPlayback(device_id).subscribe();
      });

      player.connect();
    };

    this.connectedServices$.subscribe(token => {
      this.token = token["spotify"].token;
      window.onSpotifyWebPlaybackSDKReady();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public play() {
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

  // public pause(): void {
  //   this.howlService.pause();
  // }

  // public stop(): void {
  //   this.howlService.stop();
  // }

  /**
   * When user stops dragging then seek and continue playing
   * @param evt
   */
  public sliderChange(evt: number) {
    // this.howlService.seek(evt);
    // this.howlService.play();
  }

  /**
   * When user drags slider just pause the music file and update timer as user is dragging
   */
  public sliderInput(evt: number): void {
    // this.howlService.$currentTimer.next(evt)
    // this.howlService.pause();
  }

}
