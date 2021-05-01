/* eslint-disable max-len */
import { throwError } from "rxjs";
import axios from "axios";

export const SpotifyAuthorization = {
  url: "",
  clientId: "",
  secretApi: "",
  spotifyDomain: "https://accounts.spotify.com",
  redirectUri: "",

  config(clientId: string, secretApi: string, redirectUri: string): void {
    this.clientId = clientId;
    this.secretApi = secretApi;
    this.redirectUri = redirectUri;
  },

  authorizeUrl(): string {
    if (!this.clientId) {
      throwError("Please provide a client id");
    }

    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=user-follow-read`;
    return `${this.spotifyDomain}/authorize${q}`;
  },

  async createAccessTokenUrl(oAuthCode: string): Promise<unknown> {
    if (!this.clientId) {
      throwError("Api keys are not provided!");
    }

    const url = `${this.spotifyDomain}/api/token`;

    const postHeaders = {
      headers: {
        "Authorization": "Basic " + btoa(this.clientId + ":" + this.secretApi),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `grant_type=authorization_code&code=${oAuthCode}&redirect_uri=${this.redirectUri}`;
    return await axios.post(url, params, postHeaders);
  },
};
