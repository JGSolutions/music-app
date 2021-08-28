import axios from "axios";
import { IArtists, IPlatformTypes } from "../../models/artist.types";
import { ISearchResults } from "../../models/search.model";
import { IDurationType } from "../../models/song.types";

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
        id: song.id,
        externalUrl: song.url,
        duration: song.duration,
        durationType: IDurationType.seconds,
        trackType: song.kind,
        platform: IPlatformTypes.soundcloud,
        uri: song.uri,
        streamUrl: song.stream_url,
        artistName: song.user.username,
        createdTime: song.created_at,
        pictures: {
          medium: song.artwork_url,
          large: song.artwork_url,
          exLarge: song.artwork_url,
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

  config(clientId: string, clientSecret: string, redirectUri: string): void {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  },

  setToken(token: string): void {
    this.token = token!;
  },

  authorizeUrl(): string {
    // eslint-disable-next-line max-len
    const q = `?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return `${this.soundcloudDomain}/connect${q}`;
  },

  async oauthToken(oAuthCode: string): Promise<string> {
    const postHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const apiUrl = `${this.soundcloudDomain}/oauth2/token`;
    // eslint-disable-next-line max-len
    const params = `grant_type=authorization_code&client_id=${this.clientId}&code=${oAuthCode}&client_secret=${this.clientSecret}&redirect_uri=${this.redirectUri}`;
    return await axios.post(apiUrl, params, postHeaders);
  },

  async following(): Promise<IArtists[]> {
    const url = `${this.soundcloudDomain}/me/followings?limit=50`;
    const resp = await axios.get(url, this.requestHeaders());

    return await artistListData(resp.data);
  },

  async search(query: string | undefined) {
    const urlTracks = `${this.soundcloudDomain}/tracks?q=${query}`;
    const urlArtists = `${this.soundcloudDomain}/users?q=${query}`;
    const resTracks = await axios(urlTracks, this.requestHeaders());
    const resArtists = await axios(urlArtists, this.requestHeaders());

    return {
      tracks: await searchResultTracks(resTracks.data),
      artists: await searchResultArtists(resArtists.data),
    };
  },

  requestHeaders(): any {
    return {
      headers: {
        "Authorization": "Bearer " + this.token,
      },
    };
  },
};

