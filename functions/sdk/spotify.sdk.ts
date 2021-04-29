/* eslint-disable max-len */
import { throwError } from "rxjs";
import axios from "axios";
import { IArtists, IArtistSongs } from "../src/models/IArtists.types";
import { IPlatformTypes } from "./IPlatforms.types";

export const artistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      return {
        name: artist.name,
        id: artist.uri.split(":")[2],
        username: artist.name.toLowerCase(),
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: artist.images[2].url,
          large: artist.images[1].url,
          exLarge: artist.images[0].url,
        },
      };
    });
    resolve(data);
  });
};

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
    // eslint-disable-next-line max-len
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=user-follow-read`;
    return `${this.spotifyDomain}/authorize${q}`;
  },

  async createAccessTokenUrl(oAuthCode: string): Promise<unknown> {
    if (!this.clientId) {
      throwError("Api keys are not provided!");
    }

    // eslint-disable-next-line max-len
    const url = `${this.spotifyDomain}/api/token`;

    const postHeaders = {
      headers: {
        "Authorization": "Basic " + btoa(this.clientId + ":" + this.secretApi),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // eslint-disable-next-line max-len
    const params = "grant_type=authorization_code&code=" + oAuthCode + "&redirect_uri=" + this.redirectUri;
    return await axios.post(url, params, postHeaders);
  },

};

export const SpotifySDK = {
  queryParamAccessToken: "",
  apiDomain: "https://api.spotify.com/v1",

  initialize(accessToken: string): void {
    this.queryParamAccessToken = accessToken;
  },

  async following(type: string): Promise<IArtists[]> {
    const url = `${this.apiDomain}/me/following?type=${type}`;

    const headers = {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };

    const resp = await axios(url, headers);
    return await artistsData(resp.data.artists.items);
  },

  async artistSongs(artist: string): Promise<IArtistSongs[]> {
    const url = `${this.apiDomain}/${artist}/cloudcasts/?${this.queryParamAccessToken}`;
    const resp = await axios(url);

    // return await mixcloudArtistSongs(resp.data.data);
  },
};
