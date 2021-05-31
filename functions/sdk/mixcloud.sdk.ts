/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
// import { throwError } from "rxjs";
import axios from "axios";
import { IArtists, IArtistSongs, ITrackType } from "../src/models/IArtists.types";
import { IPlatformTypes } from "./IPlatforms.types";

export const mixcloudArtistsData = (artistApi: any): Promise<IArtists[]> => {
  return new Promise((resolve) => {
    const data = artistApi.map((artist: any) => {
      return {
        name: artist.name,
        id: artist.key,
        username: artist.username,
        platform: IPlatformTypes.mixcloud,
        pictures: {
          medium: artist.pictures.medium,
          large: artist.pictures.large,
          exLarge: artist.pictures.extra_large,
        },
      };
    });
    resolve(data);
  });
};

export const mixcloudArtistSongs = (dataApi: any): Promise<IArtistSongs[]> => {
  return new Promise((resolve) => {
    const data = dataApi.map((song: any) => {
      return {
        name: song.name,
        id: song.slug,
        tags: song.tags.map((tag: any) => tag.name),
        createdTime: song.created_time,
        username: song.user.username,
        artistName: song.user.name,
        length: song.audio_length,
        trackType: ITrackType.track,
        platform: IPlatformTypes.mixcloud,
        externalUrl: song.url,
        pictures: {
          medium: song.pictures.medium,
          large: song.pictures.large,
          exLarge: song.pictures.extra_large,
        },
      };
    });
    resolve(data);
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
    // if (!this.clientId) {
    //   throwError("Please provide a client id");
    // }
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    return `${this.mixcloudDomain}/oauth/authorize${q}`;
  },

  async createAccessTokenUrl(oAuthCode: string): Promise<any> {
    // if (!this.clientId || !this.secretApi) {
    //   throwError("Api keys are not provided!");
    // }

    // eslint-disable-next-line max-len
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

  async artistSongs(artist: string, limit = 100): Promise<IArtistSongs[]> {
    const url = `${this.mixcloudApiDomain}/${artist}/cloudcasts/?${this.queryParamAccessToken}&limit=${limit}`;
    const resp = await axios(url);

    return await mixcloudArtistSongs(resp.data.data);
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

    try {
      const params = `url=${url}`;
      return await axios.post(apiUrl, params, postHeaders);
    } catch (error) {
      return await this.audioStream(url);
    }
  },

  // async audioStream(): Promise<string | null> {
  //   const url = `${this.mixcloudApiDomain}/${this.queryParamAccessToken}embed-json/?access_token=${this.queryParamAccessToken}`;
  //   const url = "https://api.mixcloud.com/spartacus/party-time/embed-json/";

  //   const res: any = await axios(url);
  //   const { data } = await res;

  //   return await this._scrapStreamUrl(data.html);
  // },

  // async _scrapStreamUrl(iframe: string) {
  //   const $ = cheerio.load(iframe);
  //   const src = $("iframe").attr("src") as string;

  //   const browser = await puppeteer.launch({
  //     headless: true,
  //   });
  //   const page = await browser.newPage();

  //   await page.goto(src);

  //   const allResultsSelector = ".widget-play-button";
  //   await page.waitForSelector(allResultsSelector);
  //   await page.click(allResultsSelector);

  //   const textContent = await page.evaluate(() => {
  //     return document.querySelector("source")!.getAttribute("src");
  //   });

  //   browser.close();

  //   return textContent;
  // },
};
