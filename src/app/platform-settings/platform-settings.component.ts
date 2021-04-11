import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConnectedServicesState } from '../core/stores/connected-services/connected-services.state';
import { ConnectedServices, IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrls: ['./platform-settings.component.scss']
})
export class PlatformSettingsComponent implements OnInit {
  @Select(ConnectedServicesState.services) connectedServices$!: Observable<ConnectedServices>;

  public isMixcloudConnected$: Observable<any> | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document) {
    // auth.config(
    //   "21832d295e3463208d2ed0371ae08791",
    //   "http://mustagheesbutt.github.io/SC_API/callback.html"
    // );
  }

  ngOnInit(): void {
    this.isMixcloudConnected$ = this.connectedServices$.pipe(
      map((services) => services[IConnectedServicesTypes.mixcloud]),
      shareReplay(1)
    )
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
}
