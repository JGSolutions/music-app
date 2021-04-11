import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrls: ['./platform-settings.component.scss']
})
export class PlatformSettingsComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document) {
    // auth.config(
    //   "21832d295e3463208d2ed0371ae08791",
    //   "http://mustagheesbutt.github.io/SC_API/callback.html"
    // );
  }

  ngOnInit(): void {
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
