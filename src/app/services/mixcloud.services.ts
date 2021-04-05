import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class MixCloudService {
    // private redirectUri: String = `${window.location.origin}/services?type=mixcloud`;

    constructor(private http: HttpClient) {}

    public getAccessCode(url: string): Observable<string> {
      return this.http.get(url).pipe(
        map((res: any) => res.access_token
      ));
    }
}

