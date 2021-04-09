import {throwError} from "rxjs";
import axios from "axios";

export const SpotifyAuthorization = {
  url: "",
  clientId: "",
  secretApi: "",
  spotifyDomain: "https://accounts.spotify.com",
  redirectUri: "",

  config(clientId: string, redirectUri: string): void {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  },

  authorizeUrl(): string {
    if (!this.clientId) {
      throwError("Please provide a client id");
    }
    // eslint-disable-next-line max-len
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return `${this.spotifyDomain}/authorize${q}`;
  },

  // createAccessToken(oAuthCode: string): string {
  //   if (!this.clientId || !this.secretApi) {
  //     throwError("Api keys are not provided!");
  //   }

  //   const redirectUrl = `${this.redirectUri}`;
  //   // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  //   return `${this.spotifyDomain}/oauth/access_token?client_id=${this.clientId}&redirect_uri=${redirectUrl}&client_secret=${this.secretApi}&code=${oAuthCode}`;
  // },

};
