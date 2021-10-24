/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { isUndefined } from "lodash";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { ISearchResults } from "../../models/search.model";
import { IArtistTracks, IDurationType, ISongTrackType } from "../../models/song.types";
import { updateConnectedSoundcloudService } from "../src/utils/connect-services-firebase";

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

export const artistSongs = (dataApi: any, artistData: any): Promise<IArtistTracks> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.title,
        id: song.id.toString(),
        createdTime: new Date(song.created_at),
        artist: [{ name: song.user.username, id: song.user.id.toString(), username: song.user.username }],
        duration: (isUndefined(song.duration)) ? 0 : song.duration,
        durationType: IDurationType.milliseconds,
        trackType: song.kind === "track" ? ISongTrackType.track : ISongTrackType.album,
        platform: IPlatformTypes.soundcloud,
        streamUrl: song.stream_url,
        externalUrl: song.permalink_url,
        pictures: {
          medium: song.artwork_url,
          large: song.artwork_url !== null ? song.artwork_url.replace("-large", "-t500x500") : null,
          exLarge: song.artwork_url !== null ? song.artwork_url.replace("-large", "-t500x500") : null,
        },
      };
    });
    resolve({
      tracks: data,
      artists: [artistDataModel(artistData)],
    });
  });
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
        id: song.id.toString(),
        externalUrl: song.permalink_url,
        duration: (isUndefined(song.duration)) ? 0 : song.duration,
        durationType: IDurationType.milliseconds,
        trackType: song.kind === "track" ? ISongTrackType.track : ISongTrackType.album,
        platform: IPlatformTypes.soundcloud,
        streamUrl: song.stream_url,
        artist: [{ name: song.user.username, id: song.user.id.toString(), username: song.user.username }],
        createdTime: new Date(song.created_at),
        pictures: {
          medium: song.artwork_url,
          large: song.artwork_url !== null ? song.artwork_url.replace("-large", "-original") : null,
          exLarge: song.artwork_url !== null ? song.artwork_url.replace("-large", "-original") : null,
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
    } catch (err: any) {
      if (err.response?.status === 401) {
        const res = await this.recreateAccessToken();
        await updateConnectedSoundcloudService(this.authorized, res.data.access_token, res.data.refresh_token);
        this.token = res.data.access_token;
        return await this.following();
      }
    }
  },

  async search(query: string | undefined) {
    const urlTracks = `${this.soundcloudDomain}/tracks?q=${query}&access=playable,preview,blocked`;
    const urlArtists = `${this.soundcloudDomain}/users?q=${query}`;
    const resTracks = await axios(urlTracks, this.requestHeaders());
    const resArtists = await axios(urlArtists, this.requestHeaders());

    return {
      tracks: await searchResultTracks(resTracks.data),
      artists: await searchResultArtists(resArtists.data),
    };
  },

  async artistSongs(user: string): Promise<IArtistTracks> {
    const trackResp = await axios(`${this.soundcloudDomain}/users/${user}/tracks?limit=100&access=playable,preview,blocked`, this.requestHeaders());
    const artistResp = await axios(`${this.soundcloudDomain}/users/${user}`, this.requestHeaders());

    return await artistSongs(trackResp.data, artistResp.data);
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

  async audioStream(url: string): Promise<any> {
    try {
      return await axios.get(url, this.requestHeaders());
    } catch (err: any) {
      if (err.response?.status === 401) {
        const res = await this.recreateAccessToken();
        await updateConnectedSoundcloudService(this.authorized, res.data.access_token, res.data.refresh_token);
        this.token = res.data.access_token;
        return await this.audioStream(url);
      }
    }
  },

  requestHeaders(): any {
    return {
      headers: {
        "Authorization": "Bearer " + this.token,
      },
    };
  },
};

