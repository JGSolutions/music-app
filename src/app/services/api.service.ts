import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IArtistBodyRequest, IArtistSongs } from '../core/stores/artists/artists.types';
import { Observable } from 'rxjs';
import { IStreamUrl } from '../core/stores/player/player.types';

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

  public artistSongs(uid: string | undefined, payload: IArtistBodyRequest[]): Observable<IArtistSongs[]> {
    const url = `${this.domainApi}/artist`;

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid as string
      })
    };

    return this.http.post<IArtistSongs[]>(url, JSON.stringify(payload), httpOptions);
  }

  public mixcloudAudioStream(uid: string): Observable<IStreamUrl> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };

    const url = `${this.domainApi}/mixcloud-audio`;
    const params = {
      key: ""
    };

    return this.http.post<IStreamUrl>(url, params, httpOptions);
  }
}

