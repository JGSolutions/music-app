import { IPlatformTypes } from "functions/sdk/IPlatforms.types";
import { ITrackType } from "functions/src/models/IArtists.types";

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
  trackType: ITrackType,
  artist?: string;
  externalUrl?: string;
}
