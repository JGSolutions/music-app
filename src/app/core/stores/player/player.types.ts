import { IPlatformTypes } from "models/artist.types";
import { ISongTrackType } from "models/song.types";

export interface IStreamUrl {
  url: string;
}
export interface IPlayerState {
  currentTrack: ICurrentTrack;
  mixcloudAudio: IStreamUrl;
  loadingPlayer: boolean;
}

export const playerStateDefault: IPlayerState = {
  currentTrack: {} as ICurrentTrack,
  mixcloudAudio: {} as IStreamUrl,
  loadingPlayer: false,
};

export interface ICurrentTrack {
  platform?: IPlatformTypes;
  name: string;
  trackType: ISongTrackType,
  artist?: string;
  externalUrl?: string;
  avatar?: string;
}
