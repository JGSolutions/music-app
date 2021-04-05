import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MusicConnectedService {
    // private redirectUri: String = `${window.location.origin}/services?type=mixcloud`;

    constructor(private http: HttpClient) {}
}
