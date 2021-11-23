import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { IPlatformTypes } from 'models/artist.types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { MixcloudAuthService } from '../services/mixcloud-auth.service';
import { MusicConnectedService } from '../services/music-connected.service';
@Component({
  selector: 'app-mixcloud-callback',
  templateUrl: './mixcloud-callback.component.html',
  styleUrls: ['./mixcloud-callback.component.scss']
})
export class MixcloudCallbackComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$: Observable<IUserType> | undefined;

  public platformTypes = IPlatformTypes;
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private mixcloudAuth: MixcloudAuthService,
    private connectedServices: MusicConnectedService) {
  }

  ngOnInit(): void {
    this.mixcloudAuth.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      `${environment.appDomain}mixcloud-callback`
    );

    let uid: string;
    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      switchMap( (data: any) => {
        const [user, params] = data;
        uid = user.uid;
        return this.mixcloudAuth.createAccessTokenUrl(params.code);
      }),
      takeUntil(this.destroy$)
    ).subscribe((data: any) => {
      this.connectedServices.connectService(uid, {
        token: data.access_token,
      }, IPlatformTypes.mixcloud);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
