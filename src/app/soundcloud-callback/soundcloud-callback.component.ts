import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { IPlatformTypes } from 'models/artist.types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { MusicConnectedService } from '../services/music-connected.service';
import { SoundcloudAuthService } from '../services/soundcloud-auth.service';
@Component({
  selector: 'app-soundcloud-callback',
  templateUrl: './soundcloud-callback.component.html',
  styleUrls: ['./soundcloud-callback.component.scss']
})
export class SoundCloudCallbackComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$: Observable<IUserType> | undefined;

  public platformTypes = IPlatformTypes;
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private soundcloudAuth:  SoundcloudAuthService,
    private connectedServices: MusicConnectedService) {
  }

  ngOnInit(): void {
    this.soundcloudAuth.config(
      environment.soundcloud.clientId,
      environment.soundcloud.secretApi,
      environment.soundcloud.uriRedirect,
    );

    let uid: string;
    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      switchMap( (data: any) => {
        const [user, params] = data;
        uid = user.uid;
        return this.soundcloudAuth.oauthToken(params.code);
      }),
      takeUntil(this.destroy$)
    ).subscribe((data: any) => {
      console.log(data);
      this.connectedServices.connectService(uid, {
        token: data.access_token,
        refresh_token: data.refresh_token,
      }, IPlatformTypes.soundcloud);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
