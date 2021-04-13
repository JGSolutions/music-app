/* eslint-disable max-len */
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
        platform: IPlatformTypes.mixcloud,
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

export const MixcloudAuthorization = {
  url: "",
  clientId: "",
  secretApi: "",
  mixcloudDomain: "https://www.mixcloud.com",
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
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return `${this.mixcloudDomain}/oauth/authorize${q}`;
  },

  async createAccessTokenUrl(oAuthCode: string): Promise<any> {
    if (!this.clientId || !this.secretApi) {
      throwError("Api keys are not provided!");
    }

    // eslint-disable-next-line max-len
    const url = `${this.mixcloudDomain}/oauth/access_token?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&client_secret=${this.secretApi}&code=${oAuthCode}`;
    return await axios.get(url);
  },

};

export const MixcloudSDK = {
  username: {},
  accessToken: "",
  queryParamAccessToken: "",
  mixcloudApiDomain: "https://api.mixcloud.com",

  initialize(accessToken: string): void {
    this.queryParamAccessToken = `access_token=${accessToken}`;
    this.accessToken = accessToken;
  },

  async getUsername(): Promise<string> {
    const url = `${this.mixcloudApiDomain}/me/?${this.queryParamAccessToken}`;
    const res: any = await axios(url);

    return await res.data.username;
  },

  async feed(): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/feed/?${this.queryParamAccessToken}&limit=1000`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },

  async following(): Promise<IArtists[]> {
    const url = `${this.mixcloudApiDomain}/me/following/?${this.queryParamAccessToken}`;
    const resp = await axios(url);

    return await mixcloudArtistsData(resp.data.data);
  },

  async artistSongs(artist: string): Promise<any> {
    const url = `${this.mixcloudApiDomain}/${artist}/cloudcasts/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },

  async playlists(): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },

  async playlistSongs(playlistName: string): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/${playlistName}/cloudcasts/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },

  async playlistDetails(playlistName: string): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/${playlistName}/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const {data} = await res;
    return data.data;
  },
};
