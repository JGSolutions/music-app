import { IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { IDurationType, ISongTrackType } from "models/song.types";

export interface ISelectedPlaylist {
  id?: string;
  playlists: string[];
  name: string;
  duration?: number;
  albumid?: string;
  artist?: string;
  albumName?: string;
  durationType?: IDurationType;
  platform: IPlatformTypes
  trackType: ISongTrackType;
  picture: IAvatar;
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
  coverImages?: string[];
}
