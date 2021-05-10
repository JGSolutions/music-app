import { IPlatformTypes } from "functions/sdk/IPlatforms.types";

export interface IPlayerState {
  currentTrack: ICurrentTrack;
}

export const playerStateDefault: IPlayerState = {
  currentTrack: {} as ICurrentTrack,
};

export interface ICurrentTrack {
  platform: IPlatformTypes;
  name: string;
  artist: string;
}
