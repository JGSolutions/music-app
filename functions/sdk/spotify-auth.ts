/* eslint-disable max-len */
import { throwError } from "rxjs";

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

    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=user-read-email,user-read-playback-state,user-read-currently-playing,user-modify-playback-state,streaming,user-read-private,user-follow-read,app-remote-control`;
    return `${this.spotifyDomain}/authorize${q}`;
  },
};
