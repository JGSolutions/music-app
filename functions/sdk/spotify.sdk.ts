import {throwError} from "rxjs";
import axios from "axios";
import {IArtists} from "../src/models/IArtists.types";
import {IPlatformTypes} from "./IPlatforms.types";


export const mixcloudArtistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      return {
        name: artist.name,
        id: artist.key,
        username: artist.username,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: artist.pictures.medium,
          large: artist.pictures.large,
          exLarge: artist.pictures.extra_large,
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

  async following(type: string) {
    // eslint-disable-next-line max-len
    const url = `${this.apiDomain}/me/following?type=${type}`;

    const headers = {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };
    try {
      const resp = await axios(url, headers);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
    // return await mixcloudArtistsData(resp.data.data);
  },
};
