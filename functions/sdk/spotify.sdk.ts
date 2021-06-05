/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import axios from "axios";
import { IArtists, IArtistSongs, ITrackType } from "../src/models/IArtists.types";
import { IPlatformTypes } from "./IPlatforms.types";
import { updateConnectedService } from "../src/utils/connect-services-firebase";
import { spotifyKeys } from "./api-keys";
import { IAuthorizationToken, IRefreshAuthorizationToken } from "../../models/spotify.model";

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

export const artistSongs = (dataApi: any): Promise<IArtistSongs[]> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.id,
        createdTime: song.release_date,
        artistName: song.name,
        externalUrl: song.url,
        length: song.album_type === "album" ? 0 : song.length,
        totalTracks: song.album_type === "album" ? song.total_tracks : 0,
        trackType: song.album_type === "album" ? ITrackType.album : ITrackType.single,
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: song.images[2],
          large: song.images[1],
          exLarge: song.images[0],
        },
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
    return await axios.post(this.accountApi, params, postHeaders);
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

  async artistSongs(artistid: string): Promise<IArtistSongs[]> {
    const url = `${this.apiDomain}/artists/${artistid}/albums/`;
    const resp = await axios(url, this.requestHeaders());

    return await artistSongs(resp.data.items);
  },

  requestHeaders() {
    return {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };
  },
};
