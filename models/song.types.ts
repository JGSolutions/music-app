import { IPlatformTypes } from "./artist.types";
import { IAvatar } from "./avatar.types";

export enum ISongTrackType {
  track,
  album,
  single,
}

export interface ISong {
  name: string;
  genres?: string[];
  platform: IPlatformTypes;
  createdTime: string;
  trackType: ISongTrackType;
  id: string;
  length: number;
  username?: string;
  artistName: string;
  pictures: IAvatar;
  totalTracks: number;
  externalUrl?: string;
}
