import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-mixcloud-callback',
  templateUrl: './mixcloud-callback.component.html',
  styleUrls: ['./mixcloud-callback.component.scss']
})
export class MixcloudCallbackComponent implements OnInit {
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private connectedServices: MusicConnectedService) {
      MixcloudAuthorization.config(
        environment.mixcloud.clientId,
        environment.mixcloud.secretApi,
        "http://localhost:4200/mixcloud-callback"
      );
    }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter((params: Params) => !isEmpty(params)),
      takeUntil(this.destroy$)
    ).subscribe(async (params: any) => {
      const res: any = await MixcloudAuthorization.createAccessTokenUrl(params.code);
      this.connectedServices.connectService({
        token: res.data.access_token,
      }, 'mixcloud');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
