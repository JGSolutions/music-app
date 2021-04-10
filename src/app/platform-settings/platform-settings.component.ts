import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { environment } from 'src/environments/environment';
import { MixCloudService } from '../services/mixcloud.services';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrls: ['./platform-settings.component.scss']
})
export class PlatformSettingsComponent implements OnInit {

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

  ngOnInit(): void {
  }

  public connectToMixcloud(): void {
    this.document.location.href = MixcloudAuthorization.authorizeUrl();
  }

  public connectToSpotify(): void {
    this.document.location.href = SpotifyAuthorization.authorizeUrl();
  }
}
