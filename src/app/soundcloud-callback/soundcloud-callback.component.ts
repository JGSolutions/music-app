import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { SoundCloudAuth } from 'functions/sdk/soundcloud-auth';
import { IPlatformTypes } from 'models/artist.types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
import { MusicConnectedService } from '../services/music-connected.service';
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
    private connectedServices: MusicConnectedService) {
  }

  ngOnInit(): void {
    SoundCloudAuth.config(
      environment.soundcloud.clientId,
      environment.soundcloud.secretApi,
      environment.soundcloud.uriRedirect,
    );

    combineLatest([this.user$, this.route.queryParams]).pipe(
      filter(([user]) => user !== null),
      takeUntil(this.destroy$)
    ).subscribe(async (data: any) => {
      const [user, params] = data;
      const res: any = await SoundCloudAuth.oauthToken(params.code);

      this.connectedServices.connectService(user.uid, {
        token: res.data.access_token,
        refresh_token: res.data.refresh_token,
      }, IPlatformTypes.soundcloud);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
