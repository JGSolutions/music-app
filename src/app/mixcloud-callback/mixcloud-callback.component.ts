import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IConnectedServicesTypes } from '../core/stores/connected-services/connected-services.types';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-mixcloud-callback',
  templateUrl: './mixcloud-callback.component.html',
  styleUrls: ['./mixcloud-callback.component.scss']
})
export class MixcloudCallbackComponent implements OnInit {
  @Select(UserState.userState) user$: Observable<IUserType> | undefined;

  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private connectedServices: MusicConnectedService) {
    }

  ngOnInit(): void {

    MixcloudAuthorization.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      "http://localhost:4200/mixcloud-callback"
    );

    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe(async (data: any) => {
      const [user, params] = data;
      const res: any = await MixcloudAuthorization.createAccessTokenUrl(params.code);
      this.connectedServices.connectService(user.uid, {
        token: res.data.access_token,
      }, IConnectedServicesTypes.mixcloud);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
