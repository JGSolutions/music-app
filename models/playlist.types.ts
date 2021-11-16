import { IPlatformTypes } from "./artist.types";
import { IAvatar } from "./avatar.types";
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
  dateAdded?: string;
  id: string;
  name: string;
  album?:  {id: string, name: string, externalUrl?: string};
  externalUrl: string;
  artists: [{id: string, name: string}];
  duration: number;
  durationType: IDurationType;
  previewUrl?: string;
  pictures: IAvatar
}

export interface IPlayListDetails {
  id: string;
  name: string;
  durationType: IDurationType;
  externalUrl: string;
  platform: IPlatformTypes;
  coverImage: string;
  likes?: number;
  totalTracks?: number;
  tracks?: IPlaylistTracks[];
}
