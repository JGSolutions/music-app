import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { IArtistBodyRequest, IArtistSongs } from '../core/stores/artists/artists.types';
import { Observable, of } from 'rxjs';
import { IStreamUrl } from '../core/stores/player/player.types';
import { environment } from 'src/environments/environment';
import { IArtists } from 'functions/src/models/IArtists.types';

@Injectable()
export class ApiService {
  private domainApi = environment.restapiDomain;

  constructor(private http: HttpClient) { }

  public artists(uid: string): Observable<Record<string, IArtists[]>> {
    const url = `${this.domainApi}/artists`;

    const headers = {
      headers: {
        "Authorization": uid
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

  public mixcloudAudioStream(uid: string, externalUrl: string): Observable<IStreamUrl> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };

    const url = `${this.domainApi}/mixcloud-audio`;
    const params = {
      externalUrl
    };

    return this.http.post<IStreamUrl>(url, params, httpOptions).pipe(
      retry(2),
      catchError((e) => {
        return of('Error', e);
      })
    );

  }

  public createSpotifyToken(code: string, uid: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };

    const url = `${this.domainApi}/create-spotify-token?code=${code}`;

    return this.http.get<string>(url, httpOptions);
  }
}
