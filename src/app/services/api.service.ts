import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IArtistBodyRequest } from '../core/stores/artists/artists.types';

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

  public artistSongs(uid: string | undefined, artistPlatform: IArtistBodyRequest[]) {
    const url = `${this.domainApi}/artist`;

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid as string
      })
    };

    return this.http.post(url, JSON.stringify(artistPlatform), httpOptions);
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

