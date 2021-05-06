import { IPlatformTypes } from "functions/sdk/IPlatforms.types";
import { IArtists, ITrackType } from "functions/src/models/IArtists.types";
import { Pictures } from "functions/src/models/IPictures.types";

export interface IArtistsState {
  artists: Record<string, IArtists[]>;
  artistSongs: IArtistSongs[]
  loading: boolean;
}

export const artistsStateDefault: IArtistsState = {
  artists: {},
  artistSongs: [],
  loading: false
};

export interface IArtistSongs {
  artistName: string;
  createdTime: string;
  id: string;
  length: number;
  name: string;
  platform: IPlatformTypes;
  totalTracks: number;
  trackType: ITrackType;
  pictures: Pictures;
}
export interface IArtistBodyRequest {
  type: string;
  username: string;
  id: string;
}
