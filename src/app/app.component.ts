import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Musicsuite';

  constructor() {

  }

  ngOnInit() {
    // this.route.queryParams.pipe(
    //   filter((params: Params) => !isEmpty(params)),
    //   switchMap((params: Params) => {
    //     const url = MixcloudAuthorization.createAccessToken(params.code);
    //     return this.mixcloudService.getAccessCode(url);
    //   })
    // ).subscribe((code: string) => {
    //   this.connectedServices.connectService({
    //     token: code,
    //   }, 'mixcloud');
    // });
  }


}
