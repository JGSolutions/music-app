import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.scss']
})
export class SpotifyCallbackComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private connectedServices: MusicConnectedService) { }

  ngOnInit(): void {
    SpotifyAuthorization.config(
      environment.spotify.clientId,
      environment.spotify.secretApi,
      "http://localhost:4200/spotify-callback",
    );

    this.route.queryParams.pipe(
      filter((params: Params) => !isEmpty(params)),
      takeUntil(this.destroy$)
    ).subscribe(async(params: any) => {
      const res: any = await SpotifyAuthorization.createAccessTokenUrl(params.code);

      this.connectedServices.connectService({
        token: res.data.access_token,
      }, 'spotify');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
