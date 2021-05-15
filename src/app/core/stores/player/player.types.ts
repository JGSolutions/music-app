import { IPlatformTypes } from "functions/sdk/IPlatforms.types";
import { ITrackType } from "functions/src/models/IArtists.types";

export interface IStreamUrl {
  url: string;
}
export interface IPlayerState {
  currentTrack: ICurrentTrack;
  mixcloudAudio: IStreamUrl;
}

export const playerStateDefault: IPlayerState = {
  currentTrack: {} as ICurrentTrack,
  mixcloudAudio: {} as IStreamUrl
};

export interface ICurrentTrack {
  platform?: IPlatformTypes;
  name: string;
  trackType: ITrackType,
  artist?: string;
}
