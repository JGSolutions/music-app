import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArtistBodyRequest, IArtists, IPlatformTypes } from 'models/artist.types';
import { IAlbum, IArtistTracks, IStreamUrl } from 'models/song.types';
import { ISearchResults } from 'models/search.model';
import { ISoundcloudStreamUrls } from '../core/stores/songs/songs.types';
import { deburr as _deburr } from 'lodash'


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

  public artistSongs(uid: string | undefined, payload: IArtistBodyRequest[]): Observable<IArtistTracks> {
    const url = `${this.domainApi}/artist`;

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid as string
      })
    };

    return this.http.post<IArtistTracks>(url, JSON.stringify(payload), httpOptions);
  }

  public artistAlbum(uid: string, platform: IPlatformTypes, id: string): Observable<IAlbum> {
    const url = `${this.domainApi}/artist-album?platform=${platform}&id=${id}`;

    const headers = {
      headers: {
        "Authorization": uid
      },
    };

    return this.http.get(url, headers).pipe(
      map((res: any) => res)
    );
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

  public soundcloudAudioStream(uid: string, url: string): Observable<ISoundcloudStreamUrls> {
    const headers = {
      headers: {
        "Authorization": uid
      },
    };

    const urlApi = `${this.domainApi}/soundcloud-audio?externalUrl=${url}s`;

    return this.http.get<ISoundcloudStreamUrls>(urlApi, headers).pipe(
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

  public spotifyPlayback(trackid: string, uid: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };
    const url = `${this.domainApi}/spotify-playback?trackid=${trackid}`;
    return this.http.get<string>(url, httpOptions);
  }

  public spotifyDevicePlayback(deviceid: string, uid: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };

    const url = `${this.domainApi}/device-playback?deviceid=${deviceid}`;
    return this.http.get<string>(url, httpOptions);
  }

  public search(searchTerm: string, uid: string): Observable<ISearchResults> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": uid
      })
    };

    const url = `${this.domainApi}/search?search=${_deburr(searchTerm)}`;
    return this.http.get<ISearchResults>(url, httpOptions);
  }
}
