import { IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { ISongTrackType } from "models/song.types";

export interface ISelectedPlaylist {
  id?: string;
  playlists: string[]
  name: string;
  playlistName?: string;
  duration?: number;
  durationType?: number;
  platform: IPlatformTypes
  trackType: ISongTrackType;
  picture: IAvatar
}

export interface IPlayerlistState {
  loadingPlaylist: boolean;
  playlistData: IPlaylist[];
  playlistTrack: ISelectedPlaylist;
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
  playlistData: [],
  playlistTrack: {} as ISelectedPlaylist
};

export interface IPlaylist {
  id?: string;
  uid: string;
  createdDate: Date;
  playlistName: string;
}
