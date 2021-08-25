/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { IDurationType, ISong, ISongTrackType } from "../../models/song.types";
import { isUndefined } from "lodash";
import { ISearchResults } from "../../models/search.model";

const artistDataModel = (artist: any) => {
  return {
    name: artist.name,
    id: artist.key,
    username: artist.username,
    platform: IPlatformTypes.mixcloud,
    pictures: {
      medium: artist.pictures?.medium,
      large: artist.pictures?.large,
      exLarge: artist.pictures?.extra_large,
    },
  };
};

export const mixcloudArtistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      return artistDataModel(artist);
    });
    resolve(data);
  });
};

export const mixcloudArtistSongs = (dataApi: any, artistData: any): Promise<any> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.slug,
        tags: song.tags.map((tag: any) => tag.name),
        createdTime: new Date(song.created_time),
        username: song.user.username,
        artistName: song.user.name,
        duration: (isUndefined(song.audio_length)) ? 0 : song.audio_length,
        durationType: IDurationType.seconds,
        trackType: ISongTrackType.track,
        platform: IPlatformTypes.mixcloud,
        externalUrl: song.url,
        pictures: {
          medium: song.pictures.medium,
          large: song.pictures.large,
          exLarge: song.pictures.extra_large,
        },
      };
    });
    resolve({
      tracks: data,
      artist: artistDataModel(artistData),
    });
  });
};

export const searchResultTracks = (dataApi: any): Promise<ISearchResults> => {
  return new Promise((resolve) => {
    const tracks = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.slug,
        externalUrl: song.url,
        duration: song.audio_length,
        durationType: IDurationType.seconds,
        trackType: ISongTrackType.track,
        platform: IPlatformTypes.mixcloud,
        uri: song.uri,
        artistName: song.user.name,
        createdTime: song.created_time,
        pictures: {
          medium: song.pictures.medium,
          large: song.pictures.large,
          exLarge: song.pictures.extra_large,
        },
      };
    });

    resolve(tracks);
  });
};

export const searchResultArtists = (dataApi: any): Promise<any> => {
  return new Promise((resolve) => {
    const artists = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.key,
        username: song.username.toLowerCase(),
        platform: IPlatformTypes.mixcloud,
        pictures: {
          medium: song.pictures.medium,
          large: song.pictures.large,
          exLarge: song.pictures.extra_large,
        },
      };
    });
    resolve(artists);
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
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return `${this.mixcloudDomain}/oauth/authorize${q}`;
  },

  async createAccessTokenUrl(oAuthCode: string): Promise<any> {
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
    const res = await axios(url);

    return await res.data.username;
  },

  async feed(): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/feed/?${this.queryParamAccessToken}&limit=1000`;
    const res: any = axios(url);
    const { data } = await res;
    return data.data;
  },

  async following(): Promise<IArtists[]> {
    const url = `${this.mixcloudApiDomain}/me/following/?${this.queryParamAccessToken}`;
    const resp = await axios(url);

    return await mixcloudArtistsData(resp.data.data);
  },

  async artistSongs(username: string, limit = 20): Promise<ISong[]> {
    const trackResp = await axios(`${this.mixcloudApiDomain}/${username}/cloudcasts/?${this.queryParamAccessToken}&limit=${limit}`);
    const artistResp = await axios(`${this.mixcloudApiDomain}/${username}/?${this.queryParamAccessToken}`);

    return await mixcloudArtistSongs(trackResp.data.data, artistResp.data);
  },

  async playlists(): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const { data } = await res;
    return data.data;
  },

  async playlistSongs(playlistName: string): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/${playlistName}/cloudcasts/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const { data } = await res;
    return data.data;
  },

  async playlistDetails(playlistName: string): Promise<any> {
    const url = `${this.mixcloudApiDomain}/me/playlists/${playlistName}/?${this.queryParamAccessToken}`;
    const res: any = axios(url);
    const { data } = await res;
    return data.data;
  },

  async audioStream(url: string): Promise<any> {
    const apiUrl = "https://www.dlmixcloud.com/ajax.php";

    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `url=${url}`;
    return await axios.post(apiUrl, params, postHeaders);
  },

  async search(query: string | undefined) {
    const urlTracks = `${this.mixcloudApiDomain}/search/?${this.queryParamAccessToken}&q=${query}&type=cloudcast`;
    const urlArtists = `${this.mixcloudApiDomain}/search/?${this.queryParamAccessToken}&q=${query}&type=user`;
    const resTracks = await axios(urlTracks);
    const resArtists = await axios(urlArtists);
    return {
      tracks: await searchResultTracks(resTracks.data.data),
      artists: await searchResultArtists(resArtists.data.data),
    };
  },
};
