import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MixcloudAuthService {
  private clientId!: string;
  private secretApi!: string;
  private redirectUri!: string;
  private mixcloudDomain  = "https://www.mixcloud.com";

  constructor(private http: HttpClient) { }

  public config(clientId: string, secretApi: string, redirectUri: string): void {
    this.clientId = clientId;
    this.secretApi = secretApi;
    this.redirectUri = redirectUri;
  }

  public authorizeUrl(): string {
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return `${this.mixcloudDomain}/oauth/authorize${q}`;
  }

  public createAccessTokenUrl(oAuthCode: string): Observable<any> {
    const url = `${this.mixcloudDomain}/oauth/access_token?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&client_secret=${this.secretApi}&code=${oAuthCode}`;
    return this.http.get<any>(url);
  }
}
