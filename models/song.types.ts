import { IPlatformTypes } from "./artist.types";
import { IAvatar } from "./avatar.types";

export enum ISongTrackType {
  track = "track",
  album = "album",
  single = "single",
}

export enum IDurationType {
  milliseconds = "milliseconds",
  seconds = "seconds",
}

export interface ISong {
  name: string;
  genres?: string[];
  platform: IPlatformTypes;
  createdTime: string;
  trackType: ISongTrackType;
  id: string;
  albumid?: string;
  albumName?: string;
  duration: number;
  durationType: IDurationType;
  username?: string;
  artistName: string;
  pictures?: IAvatar;
  totalTracks: number;
  externalUrl?: string;
  uri?: string;
  album?: IAlbumInfo;
}

export interface IAlbumInfo {
  id: string;
  genres?: string[];
  name: string;
  artist: string;
  artistid: string;
  releaseDate: string;
  totalTracks: number;
  platform: IPlatformTypes;
  externalUrl?: string;
  pictures?: IAvatar;
}

export interface IAlbum {
  album: IAlbumInfo;
  tracks: ISong[]
}
