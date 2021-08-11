/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { updateConnectedService } from "../src/utils/connect-services-firebase";
import { spotifyKeys } from "./api-keys";
import { IAuthorizationToken, IRefreshAuthorizationToken } from "../../models/spotify.model";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { IAlbum, ISong, ISongTrackType, IDurationType } from "../../models/song.types";
import { ISearchResults } from "../../models/search.model";
import { isUndefined } from "lodash";

export const artistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      let images = {};
      if (artist.images.length === 0) {
        images = {};
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
    });
    resolve(data);
  });
};

export const artistSongs = (dataApi: any): Promise<ISong[]> => {
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
    resolve(data);
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
        artistName: dataApi.artists[0].name,
        createdTime: isUndefined(song.release_date) ? new Date(dataApi.release_date) : new Date(song.release_date),
        externalUrl: song.external_urls.spotify,
        duration: song.duration_ms,
        durationType: IDurationType.milliseconds,
        trackType: song.type,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: dataApi.images[2].url,
          large: dataApi.images[1].url,
          exLarge: dataApi.images[0].url,
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
          medium: dataApi.images[2].url,
          large: dataApi.images[1].url,
          exLarge: dataApi.images[0].url,
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
    const { data } = await axios.post(this.accountApi, params, postHeaders);

    return data;
  },

  async createAccessTokenUrl(oAuthCode: any): Promise<IAuthorizationToken> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `client_id=${spotifyKeys.clientId}&client_secret=${spotifyKeys.secretApi}&grant_type=authorization_code&code=${oAuthCode}&redirect_uri=http://localhost:4200/spotify-callback`;
    const data = await axios.post(this.accountApi, params, postHeaders);
    return data.data;
  },

  async following(type: string): Promise<IArtists[]> {
    const url = `${this.apiDomain}/me/following?type=${type}`;

    try {
      const resp = await axios(url, this.requestHeaders());
      return await artistsData(resp.data.artists.items);
    } catch (err) {
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

  async artistSongs(artistid: string): Promise<ISong[]> {
    const url = `${this.apiDomain}/artists/${artistid}/albums/`;
    const resp = await axios(url, this.requestHeaders());

    return await artistSongs(resp.data.items);
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

  requestHeaders() {
    return {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };
  },
};
