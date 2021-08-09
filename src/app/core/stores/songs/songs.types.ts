import { IPlatformTypes } from "models/artist.types";
import { IAlbumInfo, IDurationType, ISong, ISongTrackType } from "models/song.types";
import { ISelectedPlaylist } from "../playlist/playlist.types";

export type ISongCommonState = ISong | ISelectedPlaylist;
export interface ISongsState {
  songs: ISongCommonState[],
  loading: boolean;
  artistAlbum: IAlbumInfo;
  currentTrack: ICurrentTrack;
}

export const songsStateDefault: ISongsState = {
  songs: [],
  artistAlbum: {} as IAlbumInfo,
  currentTrack: {} as ICurrentTrack,
  loading: true,
};

export interface ICurrentTrack {
  platform: IPlatformTypes;
  isPlaying?: boolean;
  id: string;
  albumid?: string;
  name: string;
  trackType: ISongTrackType,
  artist?: string;
  externalUrl?: string;
  avatar?: string;
  audioFile?: string;
  duration?: number;
  durationType?: IDurationType;
}
