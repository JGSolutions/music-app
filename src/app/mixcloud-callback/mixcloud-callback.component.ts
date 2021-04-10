import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MixcloudAuthorization } from 'functions/sdk/mixcloud.sdk';
import { isEmpty } from 'lodash';
import { filter, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MixCloudService } from '../services/mixcloud.services';
import { MusicConnectedService } from '../services/music-connected.services';

@Component({
  selector: 'app-mixcloud-callback',
  templateUrl: './mixcloud-callback.component.html',
  styleUrls: ['./mixcloud-callback.component.scss']
})
export class MixcloudCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private mixcloudService: MixCloudService,
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
      switchMap((params: Params) => {
        const url = MixcloudAuthorization.createAccessTokenUrl(params.code);
        return this.mixcloudService.getAccessCode(url);
      })
    ).subscribe((code: string) => {
      this.connectedServices.connectService({
        token: code,
      }, 'mixcloud');
    });
  }

}
