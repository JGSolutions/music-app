import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { authorization } from '../../functions/sdk/mixcloud.sdk';
import { environment } from '../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from "lodash";
import { filter, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private http: HttpClient) {
    authorization.config(
      environment.mixcloud.clientId,
      environment.mixcloud.secretApi,
      "http://localhost:4200"
    );
  }


  ngOnInit() {
    this.route.queryParams.pipe(
      filter((params: Params) => !isEmpty(params)),
      switchMap((params: Params) => {
        const url = authorization.createAccessToken(params.code);
        return this.http.get(url).pipe(
            map((res: any) => res.access_token
        ));
      })
    ).subscribe((access_token: string) => {
        console.log(access_token);
    });
  }

  public connectToMixcloud(): void {
    this.document.location.href = authorization.authorizeUrl();
  }

  public connectToSoundcloud(): void {


  }
}
