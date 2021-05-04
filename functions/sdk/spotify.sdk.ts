/* eslint-disable max-len */
import axios from "axios";
import { IArtists, IArtistSongs, ITrackType } from "../src/models/IArtists.types";
import { IPlatformTypes } from "./IPlatforms.types";
import { updateConnectedService } from "../src/utils/connect-services-firebase";

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

  initialize(accessToken: string, refreshToken: string, clientId: string, clientSecret: string, authorized: string): void {
    this.queryParamAccessToken = accessToken;
    this.refreshToken = refreshToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authorized = authorized;
  },

  async recreateAccessToken(): Promise<unknown> {
    const url = "https://accounts.spotify.com/api/token";

    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const params = `grant_type=refresh_token&refresh_token=${this.refreshToken}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
    return await axios.post(url, params, postHeaders);
  },

  async following(type: string): Promise<IArtists[]> {
    const url = `${this.apiDomain}/me/following?type=${type}`;

    const headers = {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };

    try {
      const resp = await axios(url, headers);
      return await artistsData(resp.data.artists.items);
    } catch (err) {
      if (err.response?.status === 401) {
        const res: any = await this.recreateAccessToken();

        await updateConnectedService(this.authorized, res.data.access_token, IPlatformTypes.spotify);
        return this.following("artist");
      }
      return [];
    }
  },

  async artistSongs(artistid: string): Promise<IArtistSongs[]> {
    const url = `${this.apiDomain}/artists/${artistid}/albums/`;
    const headers = {
      headers: {
        "Authorization": "Bearer " + this.queryParamAccessToken,
      },
    };

    const resp = await axios(url, headers);

    return await artistSongs(resp.data.items);
  },
};
