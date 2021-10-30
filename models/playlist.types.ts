import { IPlatformTypes } from "./artist.types";
import { ISongTrackType } from "./song.types";

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