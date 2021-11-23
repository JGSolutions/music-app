import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SoundcloudAuthService {
  private clientId!: string;
  private clientSecret!: string;
  private redirectUri!: string;
  private domain = "https://api.soundcloud.com";

  constructor(private http: HttpClient) { }

  public config(clientId: string, secretApi: string, redirectUri: string): void {
    this.clientId = clientId;
    this.clientSecret = secretApi;
    this.redirectUri = redirectUri;
  }

  public authorizeUrl(): string {
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return `${this.domain}/connect${q}`;
  }

  public oauthToken(oAuthCode: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      })
    };

    const apiUrl = `${this.domain}/oauth2/token`;
    const params = `grant_type=authorization_code&client_id=${this.clientId}&code=${oAuthCode}&client_secret=${this.clientSecret}&redirect_uri=${this.redirectUri}`;

    return this.http.post(apiUrl, params, httpOptions);
  }
}
