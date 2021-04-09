import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MixcloudAuthorization } from '../../functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from '../../functions/sdk/spotify.sdk';
import { environment } from '../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from "lodash";
import { filter, switchMap } from 'rxjs/operators';
import { MixCloudService } from './services/mixcloud.services';
import { MusicConnectedService } from './services/music-connected.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private connectedServices: MusicConnectedService,
    private mixcloudService: MixCloudService) {

    MixcloudAuthorization.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      "http://localhost:4200"
    );

    SpotifyAuthorization.config(
      environment.spotify.clientId,
      "http://localhost:4200"
    );

    // auth.config(
    //   "21832d295e3463208d2ed0371ae08791",
    //   "http://mustagheesbutt.github.io/SC_API/callback.html"
    // );
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter((params: Params) => !isEmpty(params)),
      switchMap((params: Params) => {
        const url = MixcloudAuthorization.createAccessToken(params.code);
        return this.mixcloudService.getAccessCode(url);
      }),
      // map((code: string) => {
      //   return this.connectedServices.connectService({
      //     token: code,
      //     username: 'jerrygag'
      //   }, 'mixcloud');
      // })
    ).subscribe((code: string) => {
      this.connectedServices.connectService({
        token: code,
      }, 'mixcloud');
    });
  }

  public connectToMixcloud(): void {
    this.document.location.href = MixcloudAuthorization.authorizeUrl();
  }

  public connectToSpotify(): void {
    this.document.location.href = SpotifyAuthorization.authorizeUrl();
  }
}
