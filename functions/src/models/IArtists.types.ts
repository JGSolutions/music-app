import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { Pictures } from "./IPictures.types";

export enum ITrackType {
  track = "track",
  album = "album",
  single = "single",
}
export interface IArtists {
  name: string;
  id: string;
  genres?: string;
  platform: IPlatformTypes;
  username: string;
  pictures: Pictures;
}
export interface IArtistSongs {
  name: string;
  genres?: string[];
  platform: IPlatformTypes;
  createdTime: string;
  trackType: ITrackType;
  id: string;
  length: number;
  username?: string;
  artistName: string;
  pictures: Pictures;
  totalTracks: number;
}

export interface IArtistBodyRequest {
  type: string;
  username: string;
  id: string;
}
