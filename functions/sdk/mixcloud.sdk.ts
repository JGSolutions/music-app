/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { IArtistTracks, IDurationType, ISongTrackType } from "../../models/song.types";
import { isUndefined } from "lodash";
import { ISearchResults } from "../../models/search.model";

const artistDataModel = (artist: any): IArtists => {
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

export const mixcloudArtistSongs = (dataApi: any, artistData: any): Promise<IArtistTracks> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.slug,
        tags: song.tags.map((tag: any) => tag.name),
        createdTime: new Date(song.created_time),
        artist: [{ name: song.user.name, username: song.user.username.toLowerCase(), id: song.key }],
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
      artists: [artistDataModel(artistData)],
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
        artist: [{ name: song.user.name, username: song.user.username.toLowerCase(), id: song.key }],
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

  async following(): Promise<IArtists[]> {
    const url = `${this.mixcloudApiDomain}/me/following/?${this.queryParamAccessToken}`;
    const resp: any = await axios(url);

    return await mixcloudArtistsData(resp.data.data);
  },

  async artistSongs(username: string, limit = 20): Promise<IArtistTracks> {
    const trackResp: any = await axios(`${this.mixcloudApiDomain}/${username}/cloudcasts/?${this.queryParamAccessToken}&limit=${limit}`);
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
    const resTracks: any = await axios(urlTracks);
    const resArtists: any = await axios(urlArtists);
    return {
      tracks: await searchResultTracks(resTracks.data.data),
      artists: await searchResultArtists(resArtists.data.data),
    };
  },
};
