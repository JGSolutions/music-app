/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { updateConnectedService } from "../src/utils/connect-services-firebase";
import { spotifyKeys } from "./api-keys";
import { IAuthorizationToken, IRefreshAuthorizationToken } from "../../models/spotify.model";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { IAlbum, ISong, ISongTrackType, IDurationType, IArtistTracks } from "../../models/song.types";
import { ISearchResults } from "../../models/search.model";
import { isUndefined } from "lodash";
import { IAvatar } from "../../models/avatar.types";
import { IPlayLists } from "../../models/playlist.types";

const artistDataModel = (artist: any): IArtists => {
  let images = {} as IAvatar;
  if (artist.images.length === 0) {
    images = {} as IAvatar;
  } else {
    images = {
      medium: artist.images[2].url,
      large: artist.images[1].url,
      exLarge: artist.images[0].url,
    };
  }
  return {
    name: artist.name,
    genres: artist.genres,
    id: artist.uri.split(":")[2],
    username: artist.name.toLowerCase(),
    platform: IPlatformTypes.spotify,
    pictures: images,
  };
};

export const artistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => artistDataModel(artist));
    resolve(data);
  });
};

export const artistSongs = (dataApi: any, artistData: any): Promise<IArtistTracks> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.id,
        createdTime: new Date(song.release_date),
        artistName: song.name,
        externalUrl: song.external_urls.spotify,
        duration: song.album_type === "album" ? 0 : song.length,
        durationType: IDurationType.milliseconds,
        totalTracks: song.total_tracks,
        trackType: song.album_type === "album" ? ISongTrackType.album : ISongTrackType.single,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: song.images[2].url,
          large: song.images[1].url,
          exLarge: song.images[0].url,
        },
      };
    });

    resolve({
      tracks: data,
      artists: [artistDataModel(artistData)],
    });
  });
};

export const artistAlbums = (dataApi: any): Promise<IAlbum> => {
  return new Promise((resolve) => {
    const tracks = dataApi.tracks.items.map((song: any) => {
      return {
        name: song.name,
        id: song.id,
        albumid: dataApi.id,
        albumName: dataApi.name,
        artist: song.artists.map((artist: any) => {
          return { name: artist.name, id: artist.id, username: artist.name.toLowerCase() };
        }),
        createdTime: isUndefined(song.release_date) ? new Date(dataApi.release_date) : new Date(song.release_date),
        externalUrl: song.external_urls.spotify,
        duration: song.duration_ms,
        durationType: IDurationType.milliseconds,
        trackType: song.type,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: dataApi.images[2]?.url || "",
          large: dataApi.images[1]?.url || "",
          exLarge: dataApi.images[0]?.url || "",
        },
      };
    });
    resolve({
      album: {
        id: dataApi.id,
        name: dataApi.name,
        artist: dataApi.artists[0].name,
        artistid: dataApi.artists[0].id,
        externalUrl: dataApi.external_urls.spotify,
        releaseDate: dataApi.release_date,
        totalTracks: dataApi.total_tracks,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: dataApi.images[2]?.url || "",
          large: dataApi.images[1]?.url || "",
          exLarge: dataApi.images[0]?.url || "",
        },
      },
      tracks,
    });
  });
};

export const albumTracks = (dataApi: any): Promise<ISong[]> => {
  return new Promise((resolve) => {
    const tracks = dataApi.items.map((song: any) => {
      return {
        name: song.name,
        id: song.id,
        externalUrl: song.external_urls.spotify,
        duration: song.duration_ms,
        durationType: IDurationType.milliseconds,
        trackType: song.type,
        platform: IPlatformTypes.spotify,
      };
    });
    resolve(tracks);
  });
};

export const searchResults = (dataApi: any): Promise<ISearchResults> => {
  return new Promise((resolve) => {
    const tracks = dataApi.tracks.items.map((song: any) => {
      return {
        name: song.name,
        id: song.id,
        externalUrl: song.external_urls.spotify,
        duration: song.duration_ms,
        durationType: IDurationType.milliseconds,
        trackType: song.type,
        platform: IPlatformTypes.spotify,
        uri: song.uri,
        artist: song.artists.map((artist: any) => {
          return { name: artist.name, id: artist.id, username: artist.name.toLowerCase() };
        }),
        pictures: {
          medium: song.album.images[2]?.url || "",
          large: song.album.images[1]?.url || "",
          exLarge: song.album.images[0]?.url || "",
        },
        album: {
          name: song.album.name,
          uri: song.album.uri,
          id: song.album.id,
          releaseDate: song.album.release_date,
          totalTracks: song.album.total_tracks,
          externalUrl: song.album.externa_urls,
        },
      };
    });

    const artists = dataApi.artists.items.map((song: any) => {
      let images = {};
      if (song.images.length === 0) {
        images = {};
      } else {
        images = {
          medium: song.images[2].url,
          large: song.images[1].url,
          exLarge: song.images[0].url,
        };
      }
      return {
        name: song.name,
        genres: song.genres,
        id: song.uri.split(":")[2],
        uri: song.uri,
        username: song.name.toLowerCase(),
        platform: IPlatformTypes.spotify,
        pictures: images,
      };
    });
    resolve({
      artists,
      tracks,
    });
  });
};

export const playListData = (dataApi: any): Promise<IPlayLists[]> => {
  return new Promise((resolve) => {
    const data = dataApi.items.map((item: any) => {
      return {
        name: item.name,
        id: item.id,
        externalUrl: item.external_urls.spotify,
        platform: IPlatformTypes.spotify,
        coverImage: item.images[0].url === null ? "" : item.images[0].url,
        totalTracks: item.tracks.total,
      };
    });

    resolve(data);
  });
};

export const SpotifySDK = {
  queryParamAccessToken: "",
  refreshToken: "",
  clientId: "",
  clientSecret: "",
  authorized: "",
  apiDomain: "https://api.spotify.com/v1",
  accountApi: "https://accounts.spotify.com/api/token",

  initialize(accessToken: string, refreshToken: string, clientId: string, clientSecret: string, authorized: string): void {
    this.queryParamAccessToken = accessToken;
    this.refreshToken = refreshToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authorized = authorized;
  },

  async recreateAccessToken(): Promise<IRefreshAuthorizationToken> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `grant_type=refresh_token&refresh_token=${this.refreshToken}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
    const data: any = await axios.post(this.accountApi, params, postHeaders);

    return data.data;
  },

  async createAccessTokenUrl(oAuthCode: any): Promise<IAuthorizationToken> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${spotifyKeys.clientId}:${spotifyKeys.secretApi}`).toString("base64")}`,
      },
    };

    // const params = `client_id=${spotifyKeys.clientId}&client_secret=${spotifyKeys.secretApi}&grant_type=authorization_code&code=${oAuthCode}&redirect_uri=http://localhost:4200/spotify-callback`;
    const params = `grant_type=authorization_code&code=${oAuthCode}&redirect_uri=https://music-app-5c927.firebaseapp.com/spotify-callback`;
    // const params = `grant_type=authorization_code&code=${oAuthCode}&redirect_uri=http://localhost:4200/spotify-callback`;
    const data: any = await axios.post(this.accountApi, params, postHeaders);
    this.queryParamAccessToken = data.data.access_token;
    return data.data;
  },

  async accountInfo(): Promise<any> {
    const resp = await axios(`${this.apiDomain}/me`, this.requestHeaders());

    return resp.data;
  },

  async following(type: string): Promise<IArtists[]> {
    const url = `${this.apiDomain}/me/following?type=${type}`;

    try {
      const resp: any = await axios(url, this.requestHeaders());
      return await artistsData(resp.data.artists.items);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const res: IRefreshAuthorizationToken = await this.recreateAccessToken();

        await updateConnectedService(this.authorized, res.access_token, IPlatformTypes.spotify);
        this.queryParamAccessToken = res.access_token;
        console.log("error occured will try again...");
        return await this.following("artist");
      }
      return [];
    }
  },

  async artistSongs(artistid: string): Promise<IArtistTracks> {
    const url = `${this.apiDomain}/artists/${artistid}/albums/`;
    const resp: any = await axios(url, this.requestHeaders());

    const artistUrl = `${this.apiDomain}/artists/${artistid}`;
    const respArtist = await axios(artistUrl, this.requestHeaders());

    return await artistSongs(resp.data.items, respArtist.data);
  },

  async getArtistAlbum(albumId: string): Promise<IAlbum> {
    const url = `${this.apiDomain}/albums/${albumId}`;
    const resp = await axios(url, this.requestHeaders());
    return await artistAlbums(resp.data);
  },

  async getAlbumTracks(albumId: string): Promise<ISong[]> {
    const url = `${this.apiDomain}/albums/${albumId}/tracks/`;
    const resp = await axios(url, this.requestHeaders());
    return await albumTracks(resp.data);
  },

  async search(query: string | undefined): Promise<ISearchResults> {
    const url = `${this.apiDomain}/search?q=${query}&type=track,artist`;
    const resp = await axios(url, this.requestHeaders());
    return await searchResults(resp.data);
  },

  async playback(id: string | undefined): Promise<any> {
    const request = {
      uris: [`spotify:track:${id}`],
    };

    try {
      return await axios.put(`${this.apiDomain}/me/player/play`, request, this.requestHeaders());
    } catch (err: any) {
      if (err.response?.status === 401) {
        // const res: IRefreshAuthorizationToken = await this.recreateAccessToken();

        // await updateConnectedService(this.authorized, res.access_token, IPlatformTypes.spotify);
        // this.queryParamAccessToken = res.access_token;
        // console.log("error occured will try again...");
        // return await this.playback(id);

        return this.reAuth(() => this.playback(id));
      }

      return;
    }
  },

  async devicePlayback(deviceId: string | undefined): Promise<any> {
    const request = { device_ids: [deviceId], play: false };

    try {
      return await axios.put(`${this.apiDomain}/me/player`, request, this.requestHeaders());
    } catch (err: any) {
      if (err.response?.status === 401) {
        // const res: IRefreshAuthorizationToken = await this.recreateAccessToken();

        // await updateConnectedService(this.authorized, res.access_token, IPlatformTypes.spotify);
        // this.queryParamAccessToken = res.access_token;
        // console.log("error occured will try again...");
        // return await this.devicePlayback(deviceId);

        return this.reAuth(() => this.devicePlayback(deviceId));
      }

      return;
    }
  },

  async reAuth(cb: () => Promise<any>): Promise<any> {
    const res: IRefreshAuthorizationToken = await this.recreateAccessToken();

    await updateConnectedService(this.authorized, res.access_token, IPlatformTypes.spotify);
    this.queryParamAccessToken = res.access_token;

    return cb();
  },

  async getPlaylists(): Promise<any> {
    const url = `${this.apiDomain}/me/playlists`;
    const resp = await axios(url, this.requestHeaders());
    return await playListData(resp.data);
  },

  async getPlaylistDetails(playlistId: string): Promise<any[]> {
    const url = `${this.apiDomain}/playlists/${playlistId}`;
    const resp = await axios(url, this.requestHeaders());
    return await albumTracks(resp.data);
  },

  requestHeaders() {
    return {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };
  },
};
