/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { ISearchResults } from "../../models/search.model";
import { IDurationType } from "../../models/song.types";
import { updateConnectedService } from "../src/utils/connect-services-firebase";

const artistDataModel = (artist: any): IArtists => {
  return {
    name: artist.full_name || artist.username,
    id: artist.id.toString(),
    username: artist.username,
    platform: IPlatformTypes.soundcloud,
    pictures: {
      medium: artist.avatar_url,
      large: artist.avatar_url,
      exLarge: artist.avatar_url,
    },
  };
};

export const searchResultArtists = (dataApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const artists = dataApi.map((song: any) => artistDataModel(song));
    resolve(artists);
  });
};

export const searchResultTracks = (dataApi: any): Promise<ISearchResults> => {
  return new Promise((resolve) => {
    const tracks = dataApi.map((song: any) => {
      return {
        name: song.title,
        id: song.id,
        externalUrl: song.url,
        duration: song.duration,
        durationType: IDurationType.seconds,
        trackType: song.kind,
        platform: IPlatformTypes.soundcloud,
        uri: song.uri,
        streamUrl: song.stream_url,
        artistName: song.user.username,
        createdTime: song.created_at,
        pictures: {
          medium: song.artwork_url,
          large: song.artwork_url,
          exLarge: song.artwork_url,
        },
      };
    });

    resolve(tracks);
  });
};

export const artistListData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.collection.map((artist: any) => artistDataModel(artist));
    resolve(data);
  });
};

export const auth = {
  url: "",
  clientId: "",
  clientSecret: "",
  soundcloudDomain: "https://api.soundcloud.com",
  redirectUri: "",
  token: "",
  refreshToken: "",
  authorized: "",

  config(clientId: string, clientSecret: string, redirectUri: string, token?: string, refreshToken?: string, authorized?: string): void {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.token = token!;
    this.refreshToken = refreshToken!;
    this.authorized = authorized!;
  },

  async following(limit = 50): Promise<any> {
    try {
      const resp = await axios.get(`${this.soundcloudDomain}/me/followings?limit=${limit}`, this.requestHeaders());
      return await artistListData(resp.data);
    } catch (err) {
      if (err.response?.status === 401) {
        const res = await this.recreateAccessToken();
        await updateConnectedService(this.authorized, res.data.access_token, IPlatformTypes.soundcloud);
        this.token = res.data.access_token;
        return await this.following();
      }
    }
  },

  async search(query: string | undefined) {
    const urlTracks = `${this.soundcloudDomain}/tracks?q=${query}`;
    const urlArtists = `${this.soundcloudDomain}/users?q=${query}`;
    const resTracks = await axios(urlTracks, this.requestHeaders());
    const resArtists = await axios(urlArtists, this.requestHeaders());

    return {
      tracks: await searchResultTracks(resTracks.data),
      artists: await searchResultArtists(resArtists.data),
    };
  },

  async recreateAccessToken(): Promise<any> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `grant_type=refresh_token&client_id=${this.clientId}&client_secret=${this.clientSecret}&redirect_uri=${this.redirectUri}&refresh_token=${this.refreshToken}`;
    return await axios.post(`${this.soundcloudDomain}/oauth2/token`, params, postHeaders);
  },

  requestHeaders(): any {
    return {
      headers: {
        "Authorization": "Bearer " + this.token,
      },
    };
  },
};

