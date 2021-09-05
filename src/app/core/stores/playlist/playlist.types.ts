import { IPlatformTypes } from "models/artist.types";
import { IAvatar } from "models/avatar.types";
import { IDurationType, ISongTrackType } from "models/song.types";

export interface ISelectedPlaylist {
  id?: string;
  playlists: string[];
  name: string;
  duration?: number;
  albumid?: string;
  artistName?: string;
  albumName?: string;
  durationType?: IDurationType;
  platform: IPlatformTypes
  trackType: ISongTrackType;
  pictures: IAvatar;
  externalUrl?: string;
  createdTime: string;
  totalTracks?: number;
  streamUrl?: string;
}

export interface IPlayerlistState {
  loadingPlaylist: boolean;
  playlistData: IPlaylist[];
  playlistDetail: IPlaylist;
  playlistTrack: ISelectedPlaylist;
  allPlaylistTracks: ISelectedPlaylist[];
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
  playlistData: [],
  playlistDetail: {} as IPlaylist,
  playlistTrack: {} as ISelectedPlaylist,
  allPlaylistTracks: []
};

export interface ICoverImages {
  id: string;
  image: string;
}

export interface IPlaylist {
  id?: string;
  uid: string;
  createdDate: Date;
  playlistName: string;
  coverImages?: ICoverImages[];
}
