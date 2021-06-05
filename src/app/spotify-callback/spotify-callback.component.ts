import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { SpotifyAuthorization } from 'functions/sdk/spotify-auth';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.scss']
})
export class SpotifyCallbackComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType> | undefined;

  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    SpotifyAuthorization.config(
      environment.spotify.clientId,
      environment.spotify.secretApi,
      "http://localhost:4200/spotify-callback",
    );

    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      switchMap((data: any) => {
        const [user, params] = data;
        return this.apiService.createSpotifyToken(params.code, user.uid);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
