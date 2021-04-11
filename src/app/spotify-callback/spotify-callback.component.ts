import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { SpotifyAuthorization } from 'functions/sdk/spotify.sdk';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { MusicConnectedService } from '../services/music-connected.services'

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.scss']
})
export class SpotifyCallbackComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$: Observable<IUserType> | undefined;

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

    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe(async(data: any) => {
      const [user, params] = data;
      const res: any = await SpotifyAuthorization.createAccessTokenUrl(params.code);

      this.connectedServices.connectService(user.uid, {
        token: res.data.access_token,
      }, IConnectedServicesTypes.spotify);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
