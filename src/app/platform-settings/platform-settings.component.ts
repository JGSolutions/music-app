import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from 'functions/sdk/spotify-auth';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ArtistsAction } from '../core/stores/artists/artists.actions';
import { DisconnectServiceAction } from '../core/stores/connected-services/connected-services.actions';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServices, ConnectedToken, IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrls: ['./platform-settings.component.scss']
})
export class PlatformSettingsComponent implements OnInit {
  @Select(ConnectedServicesState.servicesType) connectedServices$!: Observable<ConnectedServices>;
  @Select(UserState.userState) user$!: Observable<IUserType>;

  public isMixcloudConnected$: Observable<ConnectedToken> | undefined;
  public isSpotifyConnected$: Observable<ConnectedToken> | undefined;
  public connectedServices = IConnectedServicesTypes;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store) {
    // auth.config(
    //   "21832d295e3463208d2ed0371ae08791",
    //   "http://mustagheesbutt.github.io/SC_API/callback.html"
    // );
  }

  ngOnInit(): void {
    this.isMixcloudConnected$ = this.connectedServices$.pipe(
      map((services) => services[IConnectedServicesTypes.mixcloud]),
      shareReplay(1)
    );

    this.isSpotifyConnected$ = this.connectedServices$.pipe(
      map((services) => services[IConnectedServicesTypes.spotify]),
      shareReplay(1)
    );

    this.connectedServices$.pipe(
      withLatestFrom(this.user$),
      filter(([connectedServices, user]) => user !== null)
    ).subscribe(([connectedServices, user]) => {
      this.store.dispatch(new ArtistsAction(user.uid));
    });

  }

  public connectToMixcloud(): void {
    MixcloudAuthorization.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      "http://localhost:4200/mixcloud-callback"
    );

    this.document.location.href = MixcloudAuthorization.authorizeUrl();
  }

  public connectToSpotify(): void {
    SpotifyAuthorization.config(
      environment.spotify.clientId,
      environment.spotify.secretApi,
      "http://localhost:4200/spotify-callback",
    );

    this.document.location.href = SpotifyAuthorization.authorizeUrl();
  }

  public disconnectService(type: IConnectedServicesTypes) {
    this.user$.pipe(
      take(1)
    ).subscribe((user: IUserType) => {
      this.store.dispatch(new DisconnectServiceAction(user.uid, type));
    });
  }
}
