import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from 'functions/sdk/spotify-auth';
import { auth } from 'functions/sdk/soundcloud.sdk';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ArtistsAction } from '../core/stores/artists/artists.actions';
import { DisconnectServiceAction } from '../core/stores/connected-services/connected-services.actions';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServices } from '../core/stores/connected-services/connected-services.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { isEqual as _isEqual, isUndefined as _isUndefined } from "lodash";
import { IPlatformTypes } from 'models/artist.types';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrls: ['./platform-settings.component.scss']
})
export class PlatformSettingsComponent implements OnInit, OnDestroy {
  @Select(ConnectedServicesState.servicesType) connectedServices$!: Observable<ConnectedServices>;
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public isMixcloudConnected$!: Observable<boolean>;
  public isSpotifyConnected$!: Observable<boolean>;
  public connectedServices = IPlatformTypes;

  private destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store) {
    auth.config(
      environment.soundcloud.clientId,
      "https://music-app-5c927.firebaseapp.com/soundcloud-callback"
    );

    // auth.config(
    //   "21832d295e3463208d2ed0371ae08791",
    //   "http://mustagheesbutt.github.io/SC_API/callback.html"
    // );
  }

  ngOnInit(): void {
    this.isMixcloudConnected$ = this.connectedServices$.pipe(
      filter((services) => !_isUndefined(services)),
      map((services) => {
        if (services[IPlatformTypes.mixcloud]) {
          return true;
        }

        return false;
      }),
      shareReplay(1)
    );

    this.isSpotifyConnected$ = this.connectedServices$.pipe(
      filter((services) => !_isUndefined(services)),
      map((services) => {
        if (services[IPlatformTypes.spotify]) {
          return true;
        }

        return false;
      }),
      shareReplay(1)
    );

    this.connectedServices$.pipe(
      withLatestFrom(this.user$),
      takeUntil(this.destroy$),
      distinctUntilChanged((oldData, newData) => _isEqual(oldData, newData)),
      filter(([connectedServices, user]) => user !== null)
    ).subscribe(([connectedServices, user]) => {
      this.store.dispatch(new ArtistsAction(user.uid));
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public connectToMixcloud(): void {
    MixcloudAuthorization.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      `${environment.appDomain}mixcloud-callback`
    );

    this.document.location.href = MixcloudAuthorization.authorizeUrl();
  }

  public connectToSoundcloud(): void {
    this.document.location.href = auth.authorizeUrl();
  }

  public connectToSpotify(): void {
    SpotifyAuthorization.config(
      environment.spotify.clientId,
      environment.spotify.secretApi,
      `${environment.appDomain}spotify-callback`,
    );

    this.document.location.href = SpotifyAuthorization.authorizeUrl();
  }

  public disconnectService(type: IPlatformTypes) {
    this.user$.pipe(
      take(1)
    ).subscribe((user: IUserType) => {
      this.store.dispatch(new DisconnectServiceAction(user.uid, type));
    });
  }

  public settingsToService(evt: MatSlideToggleChange, platform: IPlatformTypes) {
    if (evt.checked) {
      switch (platform) {
        case IPlatformTypes.spotify:
          this.connectToSpotify();
          break;
        case IPlatformTypes.mixcloud:
          this.connectToMixcloud();
          break;
        case IPlatformTypes.soundcloud:
          this.connectToSoundcloud();
          break;
      }
    } else {
      this.disconnectService(platform);
    }
  }
}
