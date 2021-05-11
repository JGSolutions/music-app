import { IPlatformTypes } from "functions/sdk/IPlatforms.types";
import { ITrackType } from "functions/src/models/IArtists.types";

export interface IPlayerState {
  currentTrack: ICurrentTrack;
}

export const playerStateDefault: IPlayerState = {
  currentTrack: {} as ICurrentTrack,
};

export interface ICurrentTrack {
  platform?: IPlatformTypes;
  name: string;
  trackType: ITrackType,
  artist?: string;
}
