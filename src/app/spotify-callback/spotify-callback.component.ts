import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { isEmpty } from 'lodash';
import { filter, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.scss']
})
export class SpotifyCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private connectedServices: MusicConnectedService) { }

  ngOnInit(): void {
    SpotifyAuthorization.config(
      environment.spotify.clientId,
      environment.spotify.secretApi,
      "http://localhost:4200/spotify-callback",
    );

    this.route.queryParams.pipe(
      filter((params: Params) => !isEmpty(params)),
      map(async (params: Params) => {
        const res: any = await SpotifyAuthorization.createAccessTokenUrl(params.code);

        console.log(res.data.access_token);
        return res.data.access_token;
      })
    ).subscribe((code: any) => {
      console.log(code)
      this.connectedServices.connectService({
        token: code,
      }, 'spotify');
    });
  }

}
