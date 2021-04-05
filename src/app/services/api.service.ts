import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
    private uid: String = ``;
    // private domainApi = 'https://us-central1-musiquesuite-jg.cloudfunctions.net';
    private domainApi = 'http://localhost:5001';

    constructor(private http: HttpClient) {}

    // config(uid) {
    //     this.uid = uid;
    // }

    public feed() {
        const url = `${this.domainApi}/feed`;
        return this.http.post(url, {uid: this.uid}).pipe(
            map((res: any) => {
                return res;
            }
        ));
    }

    // username() {
    //     const url = `${this.domainApi}/username`;
    //     return this.http.post(url, {uid: this.uid}).pipe(
    //         map((res: any) => {
    //             return res;
    //         }
    //     ));
    // }

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

