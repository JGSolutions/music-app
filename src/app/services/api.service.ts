import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  private domainApi = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  public artists(uid: string | undefined) {
    const url = `${this.domainApi}/artists`;

    const headers = {
      headers: {
        "Authorization": uid as string
      },
    };

    return this.http.get(url, headers).pipe(
      map((res: any) => res)
    );
  }

  public artistSongs(uid: string | undefined, artistPlatform?: any[]) {
    const url = `${this.domainApi}/artist`;

    const headers = {
      headers: {
        "Authorization": uid as string
      },
    };

    return this.http.post(url, headers).pipe(
      map((res: any) => res)
    );
  }

  // audioStream(key) {
  //     const httpOptions = {
  //         headers: new HttpHeaders({
  //           'Content-Type':  'application/json'
  //         })
  //       };

  //     const url = `${this.domainApi}/audiofile`;
  //     const params = {
  //         uid: this.uid,
  //         key: key
  //     };
  //     return this.http.post(url, params, httpOptions).pipe(
  //         map((res: any) => {
  //             return res;
  //         }
  //     ));
  // }
}

