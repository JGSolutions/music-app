import { IPlatformTypes } from "models/artist.types";
import { ISongTrackType } from "models/song.types";

export interface IHistoryState {
  histroyTracks: any[];
}

export const historyStateDefault: IHistoryState = {
  histroyTracks: [],
};

export interface IHistoryTracks {
  name: string;
  dateViewed: Date;
  platform?: IPlatformTypes;
  id: string;
  trackType: ISongTrackType,
  artist?: string;
  externalUrl?: string;
  avatar?: string;
  audioFile?: string;
}
