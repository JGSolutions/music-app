import { IPlatformTypes } from "models/artist.types";
import { ISongTrackType } from "models/song.types";

export interface ISelectedSong {
  id: string;
  platform: IPlatformTypes;
  trackType: ISongTrackType;
}
