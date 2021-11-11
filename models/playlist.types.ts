import { IPlatformTypes } from "./artist.types";
import { IDurationType, ISongTrackType } from "./song.types";

export interface IPlayLists {
  id: string;
  name: string;
  externalUrl: string;
  platform: IPlatformTypes;
  coverImage: string;
  trackType?: ISongTrackType;
  lastModified?: Date;
  likes?: number;
  totalTracks?: number;
}

export interface IPlaylistTracks {
  id: string;
  album: any;
  externalUrl: string;
  artists: any[] | any;
  duration: number;
  durationType: IDurationType;
  previewUrl: string;
  name: string;
}
export interface IPlayListDetails {
  id: string;
  name: string;
  externalUrl: string;
  platform: IPlatformTypes;
  coverImage: string;
  likes?: number;
  totalTracks?: number;
  tracks: IPlaylistTracks[];
}
