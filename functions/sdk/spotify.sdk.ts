/* eslint-disable max-len */
import axios from "axios";
import { IArtists } from "../src/models/IArtists.types";
import { IPlatformTypes } from "./IPlatforms.types";
import { adminFirebase } from "../src/modules/fb";

const db = adminFirebase.firestore();

export const artistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      return {
        name: artist.name,
        id: artist.uri.split(":")[2],
        username: artist.name.toLowerCase(),
        platform: IPlatformTypes.spotify,
        pictures: {
          medium: artist.images[2].url,
          large: artist.images[1].url,
          exLarge: artist.images[0].url,
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

  async following(type: string): Promise<IArtists[] | null> {
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
      if (err.response.status === 401) {
        const res: any = await this.recreateAccessToken();

        await db.collection("connectedServices").doc(this.authorized).set({
          "spotify": {
            token: res.data.access_token,
          },
        }, { merge: true });

        this.following("artist");
      }
      return null;
    }
  },

  // async artistSongs(artist: string): Promise<IArtistSongs[]> {
  //   const url = `${this.apiDomain}/${artist}/cloudcasts/?${this.queryParamAccessToken}`;
  //   const resp = await axios(url);

  //   return await mixcloudArtistSongs(resp.data.data);
  // },
};
