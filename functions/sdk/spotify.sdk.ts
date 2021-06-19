/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { updateConnectedService } from "../src/utils/connect-services-firebase";
import { spotifyKeys } from "./api-keys";
import { IAuthorizationToken, IRefreshAuthorizationToken } from "../../models/spotify.model";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { IAlbum, ISong, ISongTrackType } from "../../models/song.types";

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
        createdTime: song.release_date,
        artistName: song.name,
        externalUrl: song.external_urls.spotify,
        length: song.album_type === "album" ? 0 : song.length,
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
        createdTime: song.release_date,
        externalUrl: song.external_urls.spotify,
        length: song.duration_ms,
        trackType: song.type,
        platform: IPlatformTypes.spotify,
      };
    });
    resolve({
      album: {
        id: dataApi.id,
        name: dataApi.name,
        externalUrl: dataApi.external_urls.spotify,
        releaseDate: dataApi.release_date,
        totalTracks: dataApi.total_tracks,
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

  requestHeaders() {
    return {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };
  },
};
